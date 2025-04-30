import Image from "next/image"

const Agent = () => {
    //use params
  return (
    <>
    <div className="agentProfile">
        <div className="agentProfilePic">
            <Image 
            width='100'
            height='100'
            src='/images/agent.jpg'
            alt='profilePic'/>
        </div>
        <div className="agentName">
            John Doe
        </div>
        <div className="address">
        <Image
    width={30}
    height={30}
    src='/icons/location.svg' 
    alt='icon'/>
     <span>Office Address:</span>
      <span>14,lorem ipsuddddddddddddddddddddddddddmdolor</span>
       
            </div>
        <div className="agentProfileInfo"></div>
    </div>
    
    </>
   
  )
}

export default Agent