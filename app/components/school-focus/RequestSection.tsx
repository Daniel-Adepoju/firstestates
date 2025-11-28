import { MoreVertical } from "lucide-react"

export const RequestSection = ({
  scrollRef,
  hasContent,
  isLoading,
  renderContent,
  renderLoading,
  isFetchingMore,
}: {
  scrollRef: React.RefObject<HTMLDivElement | null>
  hasContent: any
  isLoading: boolean
  renderContent: () => React.ReactNode
  renderLoading: () => React.ReactNode
  isFetchingMore: boolean
}) => (
  <section
    ref={scrollRef}
    className={`grid grid-flow-col auto-cols-min dark:bg-darkGray  ${
      hasContent || isLoading
        ? "h-90"
        : "h-20 whitespace-nowrap mx-auto w-full flex items-center justify-center text-sm"
    } gap-6 px-2 pt-5 pb-0 snap-x snap-mandatory overflow-x-scroll nobar null outline-2 outline-gray-100 dark:outline-black/20 rounded-lg`}
  >
    {!isLoading ? renderContent() : renderLoading()}
    {isFetchingMore && (
      <MoreVertical
        size={50}
        className="h-8 w-8 my-auto text-gray-600 dark:text-gray-100 animate-pulse"
      />
    )}
  </section>
)