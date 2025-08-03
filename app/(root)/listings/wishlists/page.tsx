import WishListCard from "@components/WishListCard"

const WishLists = () => {
  return (
    <div className="flex flex-col items-start gap-2 w-full mt-26 p-4">
      {/* <div>WishLists</div> */}
      <WishListCard />
       <WishListCard />
        <WishListCard />
         <WishListCard />
    </div>
  
  )
}

export default WishLists