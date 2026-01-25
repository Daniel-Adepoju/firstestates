import { Check, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@components/ui/popover";

const RoommateAgentControls = ({
  request,
  isOpen,
  setIsOpen,
  isDeleteOpen,
  setIsDeleteOpen,
  acceptMutation,
  deleteMutation,
}: any) => {
  const themeButtonClass =
    request?.requestType === "roommate" ? "goldPrimary" : "green-600";
  const themeGradientClass =
    request?.requestType === "roommate" ? "gold-gradient" : "bg-green-600";

  return (
    <div className="absolute top-3 left-3 z-20 flex gap-2.5">
      {/* Accept */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            className={`flex h-11 w-11 items-center justify-center rounded-full bg-${themeButtonClass} shadow-lg ring-2 ring-black/30 transition hover:scale-105`}
          >
            <Check className="h-6 w-6 text-white" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="z-800 w-64 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-0 shadow-2xl">
          <p className="mb-3 text-center text-lg font-semibold">
            Accept Request?
          </p>
          <button
            onClick={() =>
              acceptMutation.mutate({
                id: request?._id,
                status: "accepted",
                action: "acceptRequest",
              })
            }
            className={`block w-50 mx-auto text-sm rounded-full py-3 font-bold text-white ${themeGradientClass}`}
          >
            {acceptMutation.isPending ? 'Accepting ...' :'Accept'}
          </button>
        </PopoverContent>
      </Popover>

      {/* Delete */}
      <Popover open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <PopoverTrigger asChild>
          <button className="flex h-11 w-11 items-center justify-center rounded-full bg-red-600 shadow-lg ring-2 ring-black/30 transition hover:scale-105">
            <X className="h-6 w-6 text-white" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="z-800 w-64 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-0 shadow-2xl">
          <p className="mb-3 text-center text-lg font-semibold">
            Decline / Delete?
          </p>
          <button
            onClick={() => deleteMutation.mutate({ id: request?._id })}
            className="block w-50 mx-auto text-sm rounded-full bg-red-600 py-3 font-bold text-white"
          >
          {deleteMutation.isPending ? 'Deleting ...' : 'Delete'}
          </button>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default RoommateAgentControls;
