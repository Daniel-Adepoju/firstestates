import Card from "../../components/Card"

const Listings = () => {
    
  return (
    <>
    <div className="listingHistory">
       <div>
        <span>Rented</span>
       <span className="currency"> 2 </span>
       <span>properties</span>   
       </div>
     
     <div>
   <span> Currently listing</span>
    <span className="currency"> 1 </span>
   <span>property</span>
  </ div>
   
    </div>
    <div className="availableLists">
<Card />
<Card />
<Card/>
<Card />
<Card/>
<Card />      
    </div>
    </>
  )
}

export default Listings