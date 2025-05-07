import Link from "next/link"

 const Button = ({type='button',disabled, text, className,functions,href,link,children}) => {
  return (
    <button 
    type={type}
    disabled={disabled}onClick={functions} className={className}>
    <div className="left"></div> 
      <span> {text} </span>
    <div className="right"></div>
        {children}
      </button>
  )
}

export default Button
