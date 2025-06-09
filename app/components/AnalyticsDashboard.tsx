"use client"
import { analytics } from "@/utils/analytics"
import CustomBarChart from "@/components/admin/CustomBarChart"
import { formatNumber } from "@utils/formatNumber"

interface AnalyticsDashboardProps {
  avgPerDay: string
  visitorsToday: number
  totalPageViews: number
  pageViews: Awaited<ReturnType<typeof analytics.retrieveDays>>
}
const AnalyticsDashboard = ({
  totalPageViews,
  pageViews,
  avgPerDay,
  visitorsToday,
}: AnalyticsDashboardProps) => {
  return (
    <>
      <div className="adminDashboard">
        <div className="adminDashboard_header">
          <h2 className="subheading">Analytics Dashboard</h2>
        </div>
        <div className="adminDashboard_content">
          <div className="content_item banner">
            <h3>Total Pageviews</h3>
            <div className="text">
              <span>{formatNumber(totalPageViews)}</span>
            </div>
          </div>

          <div className="content_item banner">
            <h3>Visitors Today</h3>
            <div className="text">
              <span>{visitorsToday}</span>
            </div>
          </div>

          <div className="content_item  banner">
            <h3>Average Visitors Per Day</h3>
            <div className="text">
              <span>{avgPerDay}</span>
            </div>
          </div>

          {/* Vistors in the last 7 days */}
          <CustomBarChart pageViews={pageViews} />
        </div>
      </div>
    </>
  )
}

export default AnalyticsDashboard
