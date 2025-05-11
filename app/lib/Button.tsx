import Link from "next/link"

interface ButtonProps {
 type?: "button" | "submit" | "reset",
 text?: string,
 className?:string,
 disabled?: boolean,
 functions?: () => void,
 href?: string,
 link?: string,
 children?: React.ReactNode,
}
 const Button = ({type='button',disabled, text, className,functions,href,link,children}: ButtonProps) => {
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
