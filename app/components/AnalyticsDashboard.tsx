"use client"
import { analytics } from "@/utils/analytics"
import CustomBarChart from "@/components/admin/CustomBarChart"
import { formatNumber } from "@utils/formatNumber"
import Payments from "./Payments"
import { useGetAgentPayments } from "@lib/customApi"
import { getPayment } from "@lib/server/makePayment"

interface AnalyticsDashboardProps {
  avgPerDay: string
  visitorsToday: number
  totalPageViews: number
  dayPayments: number |  unknown
  weekPayments: number | unknown
  yearPayments: number | unknown
  pageViews: Awaited<ReturnType<typeof analytics.retrieveDays>>
}
const AnalyticsDashboard = ({
  totalPageViews,
  pageViews,
  avgPerDay,
  visitorsToday,
  dayPayments,
  weekPayments,
  yearPayments,
}: AnalyticsDashboardProps) => {
  const { data, isLoading } = useGetAgentPayments({ userId: "", enabled: true })

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

          <div className="content_item banner">
            <h3>Payments Made This Year</h3>
            <div className="text">
              <span>&#8358;{formatNumber(typeof yearPayments === "number" ? yearPayments : 0)}</span>
            </div>
          </div>
          <div className="content_item banner">
            <h3>Payments Made Today</h3>
            <div className="text">
              <span>&#8358;{formatNumber(typeof dayPayments === "number" ? dayPayments : 0)}</span>
            </div>
          </div>
           <div className="content_item banner">
            <h3>Payments Made This Week</h3>
            <div className="text">
              <span>&#8358;{formatNumber(typeof weekPayments === "number" ? weekPayments : 0)}</span>
            </div>
          </div>

          {/* Payments made in six months */}
          <div className="fullGrid">
            <Payments
              admin={true}
              data={data}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default AnalyticsDashboard
