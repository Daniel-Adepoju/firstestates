import ScrollController from "@components/ScrollController"
export const SectionHeader = ({
  title,
  isLoading,
  scrollRef,
}: {
  title: string
  isLoading: boolean
  scrollRef: React.RefObject<HTMLDivElement | null>
}) => (
  <div className="flex items-center justify-between w-[98%] mt-4.5 pb-2">
    <h2 className="headersFont w-120 px-4 text-lg">{title}</h2>
    {!isLoading && <ScrollController  scrollRef={scrollRef} />}
  </div>
)