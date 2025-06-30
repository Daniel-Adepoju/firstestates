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
 reverse?: boolean,
}
 const Button = ({type='button',reverse,disabled, text, className,functions,href,link,children}: ButtonProps) => {
  return (
    <button 
    type={type}
    disabled={disabled}onClick={functions} className={className}>
    <div className="left"></div>
    {reverse && children}
      <span> {text} </span>
    <div className="right"></div>
    {!reverse && children}
      </button>
  )
}

export default Button
