import React from 'react'

export const  AgentIcon = ({className}:{className:string}) => {

  return (
<div className={className}>
<svg
  viewBox="0 0 48 48"
  xmlns="http://www.w3.org/2000/svg"
  fill="currentColor"
>
  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
  <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
  <g id="SVGRepo_iconCarrier">
    <g id="Layer_2" data-name="Layer 2">
      <g id="invisible_box" data-name="invisible box">
        <rect width="48" height="48" fill="none" />
      </g>
      <g id="Layer_4" data-name="Layer 4">
        <g>
          <circle cx="35" cy="22" r="6" />
          <path d="M45.2,33.3a17.4,17.4,0,0,0-20.4,0,1.6,1.6,0,0,0-.8,1.4v5.8A1.6,1.6,0,0,0,25.6,42H44.4A1.6,1.6,0,0,0,46,40.5V34.7A1.6,1.6,0,0,0,45.2,33.3Z" />

          <defs>
            {/* Mask to punch out windows/door from the solid building */}
            <mask id="skyscraperMask">
              {/* White = visible, Black = holes */}
              <rect x="2" y="6" width="20" height="36" rx="2" fill="#fff" />

              {/* Windows grid */}
              {/* Row 1 */}
              <rect x="5" y="10" width="3" height="3" fill="#000" />
              <rect x="10" y="10" width="3" height="3" fill="#000" />
              <rect x="15" y="10" width="3" height="3" fill="#000" />
              {/* Row 2 */}
              <rect x="5" y="16" width="3" height="3" fill="#000" />
              <rect x="10" y="16" width="3" height="3" fill="#000" />
              <rect x="15" y="16" width="3" height="3" fill="#000" />
              {/* Row 3 */}
              <rect x="5" y="22" width="3" height="3" fill="#000" />
              <rect x="10" y="22" width="3" height="3" fill="#000" />
              <rect x="15" y="22" width="3" height="3" fill="#000" />
              {/* Row 4 */}
              <rect x="5" y="28" width="3" height="3" fill="#000" />
              <rect x="10" y="28" width="3" height="3" fill="#000" />
              <rect x="15" y="28" width="3" height="3" fill="#000" />
              {/* Row 5 */}
              <rect x="5" y="34" width="3" height="3" fill="#000" />
              <rect x="10" y="34" width="3" height="3" fill="#000" />
              <rect x="15" y="34" width="3" height="3" fill="#000" />
              {/* Door */}
              <rect x="10.5" y="38" width="5" height="4" rx="0.8" fill="#000" />
            </mask>
          </defs>

          <rect x="11.5" y="2" width="2" height="4" rx="1" />
          <rect x="2" y="6" width="20" height="36" rx="2" mask="url(#skyscraperMask)" />
          <rect x="6" y="6" width="12" height="2" rx="1" />
        </g>
      </g>
    </g>
  </g>
</svg>
</div>

  )
}

export const HouseSearchIcon = ({className}:{className:string}) => {

  return (
<div className={className}>
<svg xmlns="http://www.w3.org/2000/svg"
     viewBox="0 0 95 64"
     width="95" height="64"
     fill="none"
     stroke="#ffffff"
     stroke-width="2"
     stroke-linecap="round"
     stroke-linejoin="round">


  <path d="M30 28 L45 12 L60 28" />
  

  <rect x="30" y="28" width="30" height="28" rx="2" />


  <rect x="42" y="38" width="6" height="18" rx="1.5" />

 
  <rect x="34" y="34" width="6" height="6" rx="1" />
  <rect x="50" y="34" width="6" height="6" rx="1" />

  {/* <!-- Search icon (shifted a bit outward) --> */}
  <g transform="translate(74,16)">
    <circle cx="0" cy="20" r="8" />
    <line x1="5" y1="25" x2="12" y2="32" />
  </g>
</svg>

</div>

  )
}
