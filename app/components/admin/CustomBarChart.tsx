import { BarChart, Bar, XAxis, YAxis, Legend,ResponsiveContainer, Tooltip } from 'recharts'
import { analytics } from "@/utils/analytics"

interface pageViewProps {
    pageViews: Awaited<ReturnType<typeof analytics.retrieveDays>>
}
const CustomBarChart = ({pageViews}: pageViewProps) => {
  return (
    
     <>
      
      {/* Small Screen */}
      <div className="content_item barchart">
     <ResponsiveContainer width="100%" height={600}>
         <BarChart data={pageViews.map((day) => {
          return ({
            Date: day.date,
            Visitors: day.events.reduce((acc, curr) => {
              return acc + Object.values(curr)[0]!;
            }, 0),
          });
         })} barSize={30} layout="vertical">
          <XAxis fontSize={11} type="number"/>
          <YAxis fontSize={11} width={85} type='category' dataKey={'Date'}/>
       
        <Bar  dataKey='Visitors'  radius={[5, 5, 0, 0]} fill="#f29829" />
        <Tooltip />
        <Legend 
        formatter={() => <span className='subheading legend'>Visitors in the last 7 days</span>}
       verticalAlign="top"
       align="center"      
       iconType="circle" 
       iconSize={10}
       wrapperStyle={{ fontSize: 12, marginTop: -10, color: 'blue'}}
      />
      </BarChart>
     
    </ResponsiveContainer>
        </div>
        
        
        {/* Large Screen */}
            <div className="content_item barchart large">
            <ResponsiveContainer width="100%" height={600}>
                <BarChart data={pageViews.map((day) => {
                 return ({
                   Date: day.date,
                   Visitors: day.events.reduce((acc, curr) => {
                     return acc + Object.values(curr)[0]!;
                   }, 0),
                 });
                })} barSize={30}>
                 <XAxis dataKey={'Date'}/>
                 <YAxis />
              
               <Bar dataKey='Visitors'  radius={[5, 5, 0, 0]} fill="#f29829" />
               <Tooltip />
               <Legend 
               formatter={() => <span className='subheading legend'>Visitors in the last 7 days</span>}
              verticalAlign="top"
              align="center"      
              iconType="circle" 
              iconSize={10}
              wrapperStyle={{ fontSize: 12, marginTop: -10, color: 'blue'}}
             />
             </BarChart>
            
           </ResponsiveContainer>
                   </div>
                   </>
  )
}

export default CustomBarChart