import Link from "next/link"

 const Button = ({text, className,functions,href,link,children}) => {
  return (
    <div onClick={functions} className={className}>
    <div className="left"></div> 
       <span> {text} </span>
       
        <div className="right"></div>
        {children}
      </div>
  )
}

export default Button
