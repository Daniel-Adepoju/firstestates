'use client'
import Card from "@components/Card"
import { useState } from "react"
import Button from "@lib/Button"
import Image from "next/image"
import Link from "next/link"
const Listings = () => {
  const [selected, setSelected] = useState('view') 
  return (
    <>
    <div className="listingHistory">
       <div>
        <span>Rented </span>
       <strong className="currency">2</strong>
       <span>properties</span>   
       </div>
     
     <div>
   <span> Currently Listing</span>
    <strong className="currency">1</strong>
   <span>property</span>
  </ div>
   
    </div>
    
      <div className="addListing">
      <Link href={'/agent_dashboard/listings/add'}>
     <Image className="clickable" src={'/icons/add.svg'} width={50} height={50} alt="add"/>
      </Link>
        <span>Add New Listing</span>
      </div>
     
      {/* </div> */}
    <div className="availableLists">
      <div className="header">
  <div onClick={() => setSelected('view')} className={`${selected === 'view' && 'active'} subheading`}>View Listings</div>
  <div onClick={() => setSelected('edit')} className={`${selected === 'edit' && 'active'} subheading`}>Edit Listings</div> 
      </div>
<Card edit={selected === 'edit' && true}/>
<Card edit={selected === 'edit' && true}/>
<Card edit={selected === 'edit' && true}/>
<Card edit={selected === 'edit' && true}/>
<Card edit={selected === 'edit' && true}/>
<Card edit={selected === 'edit' && true}/>
<Card edit={selected === 'edit' && true}/>
<Card edit={selected === 'edit' && true}/>
<Card edit={selected === 'edit' && true}/>
<Card edit={selected === 'edit' && true}/>
<Card edit={selected === 'edit' && true}/>
<Card edit={selected === 'edit' && true}/>
    </div>
    </>
  )
}

export default Listings