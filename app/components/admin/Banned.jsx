function BannedSticker({ width = 400, height = 150 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${width} ${height}`}>
      <rect width={width} height={height} rx="20" fill="#D32F2F"/>
      <rect x="10" y="10" width={width-20} height={height-20} rx="15" 
            fill="none" stroke="#FFF" strokeWidth="6"/>
      <text 
        x={width/2} 
        y={height/2 + 30} 
        fontFamily="Impact, sans-serif" 
        fontSize="80" 
        fill="#FFF" 
        textAnchor="middle" 
        fontWeight="bold" 
        letterSpacing="2"
      >
        BANNED
      </text>
      <line x1="50" y1="40" x2={width-50} y2={height-30} 
            stroke="#FFF" strokeWidth="12" strokeLinecap="round"/>
      <path 
        d={`M0,0 Q${width/2},20 ${width},0 Q${width-20},${height/2} ${width},${height} Q${width/2},${height-20} 0,${height} Q20,${height/2} 0,0 Z`} 
        fill="#FFF" opacity="0.15"
      />
    </svg>
  );
}

export default BannedSticker;