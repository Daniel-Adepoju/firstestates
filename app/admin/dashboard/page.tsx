// 'use server'

import { analytics } from "@/utils/analytics"
import AnalyticsDashboard from "@components/AnalyticsDashboard"
import { getDate } from "@utils/date"
 import { getPayment } from "@lib/server/makePayment"

const Dashboard = async () => {
  const TRACKING_DAYS = 7
  const pageViews = await analytics.retrieveDays("pageview", TRACKING_DAYS)
  const totalPageViews = pageViews.reduce((acc, curr) => {
    return (
      acc + curr.events.reduce((acc, curr) => {
        return acc + Object.values(curr)[0]!
      }, 0)
    )
  },0)
  const avgVisitorPerDay = (totalPageViews/ TRACKING_DAYS).toFixed(1)
  const visitorsToday = pageViews.filter((ev) => ev.date === getDate()).reduce((acc, curr) => {
    return(
      acc + curr.events.reduce((acc, curr) => {
        return acc + Object.values(curr)[0]!
      }, 0)
    )
  },0)

const payments = await getPayment()
   
  return (
    <>
      <AnalyticsDashboard 
       visitorsToday={visitorsToday}
      avgPerDay={avgVisitorPerDay}
      pageViews={pageViews}
      totalPageViews={totalPageViews}
      dayPayments={payments?.getDayPayment?.amount}
      weekPayments={payments?.getWeekPayment?.amount}
      yearPayments={payments?.getYearPayment?.amount}
      />
    </>
  )
}

export default Dashboard
