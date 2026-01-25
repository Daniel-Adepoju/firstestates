


"use client";

import { CldImage } from "next-cloudinary";
import {
  AlertTriangle,
  ArrowRight,
  Bookmark,
  Check,
  MapPin,
  Mars,
  MessageCircle,
  X,
  Venus,
} from "lucide-react";
import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import Button from "@lib/Button";
import { truncateText } from "@utils/truncateText";
import Link from "next/link";
import { useNextPage } from "@lib/useIntersection"; // assuming this is your intersection hook
import { Popover, PopoverContent, PopoverTrigger } from "@components/ui/popover";
import { axiosdata } from "@utils/axiosUrl";
import { useToast } from "@utils/Toast";
import { ReportModal } from "@components/Modals";
import { useUser } from "@utils/user";
import { daysLeft } from "@utils/date";

// ────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────

interface Request {
  _id: string;
  requestType: "roommate" | "co-rent";
  preferredGender: "male" | "female";
  moveInDate?: string;
  description: string;
  isBookmarkedByUser?: boolean;
  requester: {
    _id: string;
    username: string;
    profilePic?: string;
  };
  listing?: {
    _id: string;
    mainImage?: string;
    location: string;
    address: string;
    price?: number;
  };
}

interface RoommateCardProps {
  request: Request;
  refValue?: ReturnType<typeof useNextPage> | null;
  firstItem?: boolean;
  lastItem?: boolean;
  isAgent?: boolean;
}

export const request = {
  _id: "req_123abc",
  requestType: "roommate", // or "co-rent"
  preferredGender: "male", // or "female"
  moveInDate: "2026-03-15",
  description: `Look
  ing for a clean, respectful male roommate who doesn't smoke and likes
   football. Budget
    around 180–220k. Quiet a
   rea preferre
   dddddddddddddd
   ttttttttttttttttttttttttttt
   ddddddddddddddddddddd
   .`,
  isBookmarkedByUser: false,
  requester: {
    _id: "usr_456def",
    username: "ChineduOkeke",
    profilePic: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  listing: {
    _id: "lst_789ghi",
    mainImage: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
    location: "Lekki Phase 1",
    address: "Ocean Bay Estate, behind Eko Hotel, Victoria Island Extension",
    price: 450000,
  },
};

// ─────────────────────────────
// Component
// ────────────────────────────────────────────────

export default function RoommateCard({
  // request,
  refValue,
  firstItem = false,
  lastItem = false,
  isAgent = false,
}: RoommateCardProps) {
  const [showListing, setShowListing] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  const queryClient = useQueryClient();
  const { setToastValues } = useToast();
  const { session } = useUser();
  const userId = session?.user?.id ?? "";

  const isMaleRequest = request.preferredGender === "male";
  const themeColor = isMaleRequest ? "green" : "pink";
  const themeBg = isMaleRequest ? "green-600" : "goldPrimary"; // for buttons

  // ─── Mutations ───────────────────────────────────────

  const patchRequest = async (payload: any) => {
    const res = await axiosdata.value.patch("/api/requests", payload);
    if (res.status !== 200) throw new Error(res.data?.message || "Failed");
    return res.data;
  };

  const deleteRequest = async (id: string) => {
    const res = await axiosdata.value.delete("/api/requests", {
      data: { id },
    });
    if (res.status !== 200) throw new Error("Delete failed");
    return res.data;
  };

  const bookmarkMutation = useMutation({
    mutationFn: (payload: { requestId: string; userId: string; action: string }) =>
      patchRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      setToastValues({
        isActive: true,
        message: "Bookmark updated",
        status: "success",
        duration: 2200,
      });
    },
    onError: () => {
      setToastValues({
        isActive: true,
        message: "Could not update bookmark",
        status: "danger",
        duration: 3000,
      });
    },
  });

  const acceptMutation = useMutation({
    mutationFn: () =>
      patchRequest({
        id: request._id,
        status: "accepted",
        action: "acceptRequest",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      setToastValues({
        isActive: true,
        message: "Request accepted",
        status: "success",
      });
    },
    onError: () => {
      setToastValues({ isActive: true, message: "Failed to accept", status: "danger" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteRequest(request._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      setToastValues({ isActive: true, message: "Request removed", status: "success" });
    },
    onError: () => {
      setToastValues({ isActive: true, message: "Delete failed", status: "danger" });
    },
  });

  // ─── Render ──────────────────────────────────────────

  const genderIcon = isMaleRequest ? (
    <Mars className="text-green-500" size={18} />
  ) : (
    <Venus className="text-pink-500" size={18} />
  );

  return (
    <div
      ref={refValue}
      className={`
        w-[90vw] max-w-[380px] snap-center mt-20
        ${firstItem ? "ml-4 md:ml-10" : ""}
        ${lastItem ? "mr-4 md:mr-10" : ""}
      `}
    >
      {/* Agent controls */}
      {isAgent && (
        <div className="mb-2 flex gap-3 pl-2">
          <Popover>
            <PopoverTrigger asChild>
              <button
                className={`flex h-10 w-10 items-center justify-center rounded-full shadow-md ${
                  themeColor === "green" ? "bg-green-600" : "bg-amber-600"
                } transition hover:brightness-110`}
              >
                <Check className="text-white" size={20} />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 bg-gray-50 dark:bg-gray-800">
              <p className="mb-3 text-center font-medium">Accept this request?</p>
              <button
                onClick={() => acceptMutation.mutate()}
                disabled={acceptMutation.isPending}
                className={`w-full rounded-xl py-2.5 font-semibold text-white ${
                  themeColor === "green" ? "bg-green-600" : "bg-amber-600"
                } disabled:opacity-60`}
              >
                {acceptMutation.isPending ? "Accepting…" : "Accept"}
              </button>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 shadow-md transition hover:brightness-110">
                <X className="text-white" size={20} />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 bg-gray-50 dark:bg-gray-800">
              <p className="mb-3 text-center font-medium">Decline / Delete?</p>
              <button
                onClick={() => deleteMutation.mutate()}
                disabled={deleteMutation.isPending}
                className="w-full rounded-xl bg-red-600 py-2.5 font-semibold text-white disabled:opacity-60"
              >
                {deleteMutation.isPending ? "Deleting…" : "Delete"}
              </button>
            </PopoverContent>
          </Popover>
        </div>
      )}

      {/* ─── Main Card ──────────────────────────────────────── */}

      <div
        className={`
          relative h-[min(520px,80vh)] overflow-hidden rounded-2xl
          border border-gray-200/60 dark:border-gray-700/40
          ${isMaleRequest ? "green-gradient-vertical" : "pink-gradient-vertical"}
          shadow-sm transition-shadow hover:shadow-md
        `}
      >
        {/* Toggle button */}
        <Button
          className={`
            absolute left-1/2 top-3 z-10 -translate-x-1/2
            rounded-full bg-black/40 px-5 py-2.5 text-sm font-medium text-white
            backdrop-blur-sm hover:bg-black/60
          `}
          text={showListing ? "Show Applicant" : "Show Listing"}
          functions={() => setShowListing(!showListing)}
        />

        {!showListing ? (
          /* REQUEST VIEW */
          <div className="flex h-full flex-col px-4 pt-16 pb-5">
            {/* Avatar + name */}
            <div className="mb-3 flex flex-col items-center">
              <CldImage
                src={request.requester.profilePic ?? "/fallback-avatar.jpg"}
                alt={request.requester.username}
                width={64}
                height={64}
                className="mb-2 rounded-full border-2 border-white/80 object-cover shadow-md"
              />
              <span className="text-base font-semibold text-white/95">
                {request.requester.username}
              </span>
            </div>

            {/* Action row */}
            <div className="mb-4 mt-2 flex justify-center gap-10 text-white">
              <Link
                href={`/chat?recipientId=${request.requester._id}`}
                className="flex flex-col items-center gap-1 transition hover:text-gray-200"
              >
                <MessageCircle size={28} />
                <span className="text-xs font-medium">Chat</span>
              </Link>

              {!isAgent && (
                <button
                  onClick={() =>
                    bookmarkMutation.mutate({
                      requestId: request._id,
                      userId,
                      action: "bookmarkRequest",
                    })
                  }
                  className="flex flex-col items-center gap-1 transition hover:text-gray-200"
                  disabled={bookmarkMutation.isPending}
                >
                  <Bookmark
                    size={28}
                    fill={request.isBookmarkedByUser ? "white" : "none"}
                  />
                  <span className="text-xs font-medium">
                    {bookmarkMutation.isPending ? "…" : "Bookmark"}
                  </span>
                </button>
              )}

              <button
                onClick={() => setReportModalOpen(true)}
                className="flex flex-col items-center gap-1 transition hover:text-gray-200"
              >
                <AlertTriangle size={28} />
                <span className="text-xs font-medium">Report</span>
              </button>
            </div>

            {/* Info box */}
            <div
              className={`
                flex-1 overflow-y-auto rounded-xl bg-white/95 p-4 text-sm
                shadow-inner backdrop-blur-sm dark:bg-gray-900/80 bar-custom
                ${themeColor}-bar
              `}
            >
              <div className="mb-3 flex items-center gap-2 rounded-lg bg-black/5 px-3 py-2 dark:bg-white/5">
                {genderIcon}
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  Looking for a {request.preferredGender}{" "}
                  {request.requestType === "roommate" ? "roommate" : "co-renter"}
                </span>
              </div>

              {request.moveInDate && (
                <div className="mb-3 text-xs text-gray-700 dark:text-gray-300">
                  Preferred move-in:{" "}
                  <span className="font-medium">
                    {new Date(request.moveInDate).toLocaleDateString("en-GB")}{" "}
                    (in {daysLeft(request.moveInDate)} days)
                  </span>
                </div>
              )}

              <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-gray-800 dark:text-gray-200">
                {request.description || "No description provided."}
              </p>
            </div>
          </div>
        ) : (
          /* LISTING VIEW */
          <div className="flex h-full flex-col px-4 pt-16 pb-6">
            {request.listing?.mainImage && (
              <CldImage
                src={request.listing.mainImage}
                alt="Listing"
                width={400}
                height={300}
                crop="fill"
                gravity="center"
                className="mb-4 h-52 w-full rounded-xl object-cover shadow-md"
              />
            )}

            <div className="flex-1 rounded-xl bg-white/90 p-5 dark:bg-gray-900/80">
              <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                {request.listing?.location}
              </h3>

              <p className="mb-4 flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300">
                <MapPin size={16} className="flex-shrink-0" />
                {truncateText(request.listing?.address ?? "", 45)}
              </p>

              <Link
                href={`/listings/single_listing?id=${request.listing?._id}`}
                className="inline-flex items-center gap-2 font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                View full listing
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        )}
      </div>

      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        userId={userId}
        reportedUser={request.requester._id}
        action={request.requestType === "roommate" ? "roommate request" : "co-rent request"}
      />
    </div>
  );
}

// dummy-data.ts
