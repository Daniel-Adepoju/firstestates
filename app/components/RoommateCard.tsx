"use client";

import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@utils/user";
import { useToast } from "@utils/Toast";
import { axiosdata } from "@utils/axiosUrl";
import { useNextPage } from "@lib/useIntersection";

import RoommateAgentControls from "@components/roommate-card-components/RoommateAgentControls";
import RoommateCardBody from "@components/roommate-card-components/RoommateCardBody";
import { ReportModal } from "@components/Modals";

interface RoommateCardProps {
  request: Request;
  refValue?: ReturnType<typeof useNextPage> | null;
  firstItem?: boolean;
  lastItem?: boolean;
  isAgent?: boolean;
}

const RoommateCard = ({
  request,
  refValue,
  firstItem,
  lastItem,
  isAgent = false,
}: RoommateCardProps) => {
  const [showListing, setShowListing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const reportRef = useRef<any>(null);
  const queryClient = useQueryClient();
  const { setToastValues } = useToast();
  const { session } = useUser();

  const userId = session?.user.id || "";

  // ─── Mutations (UNCHANGED) ─────────────────────────

  const bookmarkMutation = useMutation({
    mutationFn: (val: any) => axiosdata.value.patch(`/api/requests`, val),
    onSuccess: (res: any) => {
      setToastValues({
        isActive: true,
        message: res?.data?.message ?? "Success",
        status: "success",
        duration: 2000,
      });
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });

  const acceptMutation = useMutation({
    mutationFn: (val: any) => axiosdata.value.patch(`/api/requests`, val),
    onSuccess: () => {
      setToastValues({
        isActive: true,
        message: "Request accepted successfully",
        status: "success",
        duration: 2000,
      });
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (val: any) =>
      axiosdata.value.delete(`/api/requests`, { data: { id: val.id } }),
    onSuccess: () => {
      setToastValues({
        isActive: true,
        message: "Request deleted successfully",
        status: "success",
        duration: 2000,
      });
      setIsDeleteOpen(false);
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });

  return (
    <div
      ref={refValue}
      className={`
        relative w-[90vw] max-w-[380px] mx-auto snap-center
        ${firstItem ? "ml-6 md:ml-10" : ""}
        ${lastItem ? "mr-6 md:mr-10" : ""}
      `}
    >
      {isAgent && (
        <RoommateAgentControls
          request={request}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          isDeleteOpen={isDeleteOpen}
          setIsDeleteOpen={setIsDeleteOpen}
          acceptMutation={acceptMutation}
          deleteMutation={deleteMutation}
        />
      )}

      <RoommateCardBody
        request={request}
        showListing={showListing}
        setShowListing={setShowListing}
        bookmarkMutation={bookmarkMutation}
        isAgent={isAgent}
        userId={userId}
        reportRef={reportRef}
      />

      <ReportModal
        ref={reportRef}
        userId={userId}
        reportedUser={request?.requester?._id}
        action={
          request?.requestType === "roommate"
            ? "roommate request"
            : "co-rent request"
        }
      />
    </div>
  );
};

export default RoommateCard;
