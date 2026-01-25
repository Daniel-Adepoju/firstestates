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
    className={` bg-white dark:bg-darkGray ${isLoading && 'h-90'} ${
      hasContent || isLoading
        ? " grid grid-flow-col auto-cols-min pt-5"
        : "h-20 whitespace-nowrap mx-auto  w-full text-sm flex items-center justify-center"
    } gap-6 px-2  pb-0 snap-x snap-mandatory overflow-x-scroll nobar null outline-2 outline-gray-200 dark:outline-black/20 rounded-lg`}
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
