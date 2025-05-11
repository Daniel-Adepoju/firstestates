'use client'
    import { analytics } from "@/utils/analytics"
    import { BarChart, Bar, XAxis, YAxis, Legend,ResponsiveContainer, Tooltip } from 'recharts'
   
interface AnalyticsDashboardProps {
 avgPerDay:string,
 visitorsToday: number,
 totalPageViews: number,
 pageViews: Awaited<ReturnType<typeof analytics.retrieveDays>>,
}
    const AnalyticsDashboard = ({totalPageViews,pageViews,avgPerDay, visitorsToday}: AnalyticsDashboardProps) => {
  return (
    <>
    <div className="adminDashboard">
        <div className="adminDashboard_header">
            <h2 className='subheading'>Analytics Dashboard</h2>
        </div>
        <div className="adminDashboard_content">
            <div className="content_item banner">
            <h3>Total Pageviews</h3>
         <div className="text">
          <span>
            {totalPageViews} 
            </span>
          </div>  
            </div>
      
            <div className="content_item banner">
            <h3>Visitors Today</h3>
            <div className="text">
              <span>
           {visitorsToday}
              </span>
              </div>
            </div>

            <div className="content_item  banner">
            <h3>Average Visitors Per Day</h3>
            <div className="text">
              <span>
                {avgPerDay}
                </span>
              </div>
            </div>

            {/* Vistors in the last 7 days */}
     {pageViews &&
     <>
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
        formatter={(value) => <span className='subheading legend'>Visitors in the last 7 days</span>}
       verticalAlign="top"
       align="center"      
       iconType="circle" 
       iconSize={10}
       wrapperStyle={{ fontSize: 12, marginTop: -10, color: 'blue'}}
      />
      </BarChart>
     
    </ResponsiveContainer>
            </div>
            
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
               formatter={(value) => <span className='subheading legend'>Visitors in the last 7 days</span>}
              verticalAlign="top"
              align="center"      
              iconType="circle" 
              iconSize={10}
              wrapperStyle={{ fontSize: 12, marginTop: -10, color: 'blue'}}
             />
             </BarChart>
            
           </ResponsiveContainer>
                   </div>
                   </>}
        </div>
    </div>
  

    </>
    
  )
}

export default AnalyticsDashboard