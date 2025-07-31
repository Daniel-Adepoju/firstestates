"use client"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "swiper/css/scrollbar"
import { useState, useRef } from "react"
import Image from "next/image"
import Button from "@lib/Button"
import { Swiper, SwiperSlide } from "swiper/react"
import SwiperControls from "@utils/SwpierControls"
import { Pagination, Autoplay, A11y, EffectCoverflow } from "swiper/modules"
import { CldImage } from "next-cloudinary"
import { useSearchParams,useRouter } from "next/navigation"
import Link from "next/link"
import { Skeleton } from "@components/ui/skeleton"
import { useGetSingleListing } from "@lib/customApi"
import { useDarkMode } from "@lib/DarkModeProvider"
import { MapPin, Toilet, Bed, Bath, Phone,Loader2,MessageCircle, Flag,ScanSearch, HeartPlus} from "lucide-react"
import { Comment, WriteComment, CommentProps } from "@components/Comment"
import { useGetComments } from "@lib/customApi"
import { useNextPage } from "@lib/useIntersection"
import { useUser } from "@utils/user"
import { ReportListingModal } from "@components/Modals"

const SingleListing = () => {
  const {session} = useUser()
  const [isSwiperLoaded, setIsSwiperLoaded] = useState(false)
  const listingId = useSearchParams().get("id")
  const { darkMode } = useDarkMode()
  const router = useRouter()
  const reportModalRef = useRef<HTMLDialogElement>(null)
  const { data, isLoading, isError } = useGetSingleListing(listingId)
  const {
    data: commentsData,
    isLoading: commentLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetComments({ listingId: listingId ?? "", page: "1", limit: 10 })
  const ref = useNextPage({ commentLoading, hasNextPage, fetchNextPage })

  const handlePhoneClick = () => {
    window.open(`tel:${data?.post.agent.phone}`)
  }
  const handleChatClick = () => {

   router.push(`/chat?=${data?.post.agent._id}`)
  }
  const openInGoogleMap = (address: string) => {
    const encodedAddress = encodeURIComponent(address)
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, "_blank")
  }

  const handleReport = () => {
      reportModalRef.current?.showModal()
  }

  if (isLoading) {
    return (
      <div className="gap-[30px] flex flex-col  items-center w-full min-h-screen">
        <Skeleton className="bg-gray-500/20 w-full h-[300px] rounded-4xl" />
        <Skeleton className="bg-gray-500/20 w-[90%] h-[100px] rounded-xl" />
        <Skeleton className=" bg-gray-500/20 w-[80%] h-[190px] rounded-xl" />
      </div>
    )
  }
  if (isError) {
    return (
      <div
        className="flex flex-col
      items-center
      justify-center
      text-red-600
      text-xl
      w-full  min-h-screen
       bg-black"
      >
        An error occured due to issues with your network or because the page no longer exists
      </div>
    )
  }
  return (
    <>
      <div className="singleCardCon">

         <div className="singleCardSection">
          <div className="single_card">
            <div className="header">
              <div className="house">
                <Swiper
                  className="house"
                  modules={[Pagination, Autoplay, A11y, EffectCoverflow]}
                  a11y={{ enabled: true }}
                  spaceBetween={0}
                  slidesPerView={1}
                  loop={true}
                  autoplay={{ delay: 5000, disableOnInteraction: false }}
                  navigation
                  onSwiper={() => setIsSwiperLoaded(true)}
                  pagination={{ clickable: true, type: "bullets" }}
                >
                  {data?.post.gallery.map((image: string) => {
                    return (
                      <SwiperSlide
                        key={image}
                        className={`item ${isSwiperLoaded === false && "itemHide"}`}
                      >
                        <CldImage
                          alt="gallery picture"
                          src={image ? image : "firstestatesdefaultuserpicture"}
                          fill={true}
                          priority={true}
                        />
                      </SwiperSlide>
                    )
                  })}

                  <SwiperControls />
                </Swiper>
              </div>
              <div className="heading location">{data?.post.location}</div>
              <div className="address">
                <MapPin
                  size={30}
                  color={darkMode ? "#A88F6E" : "#0881A3"}
                />
                <span>{data?.post.address}</span>
              </div>
            </div>

            <div className="body">
              <div className="home_details">
                <div>
                  <Bed
                    size={30}
                    color={darkMode ? "#A88F6E" : "#0881A3"}
                  />
                  <span>{data?.post.bedrooms} bedrooms</span>
                </div>
                <div>
                  <Bath
                    size={30}
                    color={darkMode ? "#A88F6E" : "#0881A3"}
                  />
                  <span>{data?.post.bathrooms} bathrooms</span>
                </div>
                <div>
                  <Toilet
                    size={30}
                    color={darkMode ? "#A88F6E" : "#0881A3"}
                  />
                  <span>{data?.post.toilets} toilets</span>
                </div>
              </div>
            </div>
            <Button
              functions={() => openInGoogleMap(data?.post.address)}
              className="clickable directional darkblueBtn openMap"
            >
              <Image
                width={30}
                height={30}
                alt="mapBtn"
                src={"/icons/map.svg"}
              />
              <span>Open In Map</span>
            </Button>
          </div>
        </div>

        
        <div className="singleCardSection">
          <div className="single_card">
            <div className="price">
              <span className="currency">&#8358;</span>
              {data?.post.price.toLocaleString()}/Year
            </div>
            <div className="school capitalize text-xl">{data?.post.school}</div>
            <div className="agent">
              <CldImage
                width={20}
                height={20}
                alt="agent pic"
                crop={'auto'}
                src={data?.post.agent.profilePic}
              />
              <div>
                Listed by <span className="agentCardName">
                  <Link href={`/agent-view/${data?.post.agent._id}`}>{data?.post.agent.username}</Link>
                  </span>
              </div>
            </div>

            {session?.user.role === "admin" ? 
          <div className="flex flex-col items-center w-full text-gray-500 dark:text-white text-sm">
       You have admin priviledges, you can delete this listing
          <div
          onClick={() => {
            router.push(`/admin/listings/${data?.post._id}`)
          }}
          className="smallScale text-md font-extrabold rounded-md p-2 px-10
           bg-gray-500/10 report cursor-pointer flex flex-row items-center gap-2">
          <ScanSearch size={24} color='green' />
          <span>Investigate Listing</span>
          </div>
          </div>
         : session?.user?.id === data?.post.agent._id + 'lk' ? (
            <div className="text-gray-500 dark:text-white text-sm">
              You are the owner of this listing
            </div>
          ) : session?.user ? (
            <div
              onClick={handleReport}
              className="smallScale text-md font-extrabold rounded-md p-2 px-4
               bg-gray-500/10 report cursor-pointer flex flex-row items-center gap-2">
              <Flag size={20} color="darkred" /> <span>Report this listing</span>
            </div>
          ) : (
            <div>Log in to report listing </div>
          )
        }
        <div className="bg-gray-500/10 p-2  px-4 w-55 rounded-sm 
        flex items-center justify-center gap-2 cursor-pointer smallScale">
         <HeartPlus
         size={25}
         className="text-red-700"/>
          Add to wishlist
          </div>
          </div>

          {/* agents details */}
          <div className="single_card agent_details">
            <div className="txt heading">Agent&apos;s Details</div>
            <div className="details">
              <div className="subheading">Office Address</div>
              <div className="address">
                <MapPin
                  size={30}
                  color={darkMode ? "#A88F6E" : "#0881A3"}
                />
                <span>{data?.post.agent.address}</span>
              </div>
              <div className="subheading">Contacts</div>
              <div className="contact_items dark:text-white text-gray-600">
                <div
                  className="hover:scale-95 transition-transform duration-200"
                  onClick={handlePhoneClick}
                >
                  <Phone
                    size={35}
                    color={darkMode ? "#A88F6E" : "#0881A3"}
                  />
                </div>
                <span> {data?.post.agent.phone}</span>
              </div>
             {session?.user.id !== data?.post.agent._id &&
              <div className="contact_items w-full dark:text-white text-gray-600">
                <div
                  className="hover:scale-95 transition-transform duration-200"
                  onClick={handleChatClick}
                >
                  <MessageCircle
                    size={35}
                    color={darkMode ? "#A88F6E" : "#0881A3"}
                  />
                </div>
              {session ? <Link href={`/chat?recipientId=${data?.post.agent._id}`} className="cursor-pointer">Chat With Agent</Link> : <span className="w-full">Log In To Chat With Agent</span>}
              </div>}
            </div>
          </div>
        </div>
        
        {/* report to delete */}
           {/* <div
              onClick={handleReport}
              className="smallScale text-md font-extrabold rounded-md p-2 px-4
               bg-gray-500/10 report cursor-pointer flex flex-row items-center gap-2">
              <Flag size={20} color="darkred" /> <span>Report this listing</span>
            </div> */}
{/* ll */}

      </div>

      <div className="singleCardCon2">
        {/* description */}
        <div className="singleCardSection">
          <div className="single_card">
            <div className="heading mx-auto">Description</div>
            <div className="description whitespace-prewrap">{data?.post.description}</div>
          </div>
        </div>

        {/* comments */}
        <div className="singleCardSection relative">
          <div className="single_card">
            <div className="heading mx-auto">Comments</div>
            <div
              className="
     
      pb-16 pt-6 mt-2 flex flex-col w-full
      justify-start items-center
       gap-4
      max-h-200
      overflow-y-auto
      nobar
      "
            >
              {commentLoading ? (
                <Skeleton className="bg-gray-200 w-full h-[100px] rounded-xl" />
              ) : commentsData?.pages[0].comments.length === 0 ? (
                <div className="text-gray-500 dark:text-white text-center">
                  No comments yet. Be the first to share your thoughts!
                </div>
              ) : (
                commentsData?.pages.flatMap((items) =>
                  items.comments.map((comment: CommentProps, index: Number) => (
                    <>
                      <Comment
                        key={comment._id}
                        comment={comment}
                        refValue={index === items.comments.length - 1 ? ref : null}
                        listingId={listingId ?? ""}
                      />
                      {isFetchingNextPage && (
                        <Loader2
                          size={20}
                          className="animate-spin absolute bottom-12 left-[50%}"
                          color={darkMode ? "#A88F6E" : "#0881A3"}
                        />
                      )}
                    </>
                  ))
                )
              )}
            </div>
            <WriteComment listingId={listingId ?? ""} />
          </div>
        </div>
      </div>

        <ReportListingModal 
        ref={reportModalRef} 
        userId={session?.user.id ?? ""}
        reportedUser={data?.post.agent._id ?? ""}
        reportedListing={data?.post._id ?? ""}
        thumbnail={data?.post.mainImage ?? ""}
        />
    </>
  )
}

export default SingleListing
