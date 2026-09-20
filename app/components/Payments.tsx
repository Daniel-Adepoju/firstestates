"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

import { months } from "@utils/date"
import { useDarkMode } from "@lib/DarkModeProvider"
import { MoreHorizontal, Banknote } from "lucide-react"

interface PaymentProps {
  data: any[]
  isLoading: boolean
  admin?: boolean
  type?: string
}

const Payments = ({ data, isLoading = true, admin, type = "made-by-you" }: PaymentProps) => {
  const { darkMode } = useDarkMode()
  const mappedData = data?.map((item: any) => {
    return {
      month: months[item._id.month - 1],
      Amount: item.totalAmount,
    }
  })

  if (isLoading) {
    return (
      <div className="w-full flex-1 rounded-3xl border border-border/60 bg-background/70 p-5 shadow-sm backdrop-blur-md sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/70">
              Account activity
            </p>
            <h2 className="mt-1 text-xl font-semibold text-foreground">
              {type === "made-by-you"
                ? "Payments - Last 6 Months"
                : "Payments Made By You - Last 6 Months"}
            </h2>
          </div>
          <Banknote
            className="text-primary/70"
            size={23}
          />
        </div>
        <div className="mt-6 flex h-32 items-center justify-center gap-1 rounded-2xl border border-dashed border-border bg-secondary/45 font-semibold text-foreground">
          <span className="text-2xl">Loading Payments</span>
          <MoreHorizontal
            size={30}
            color={darkMode ? "white" : "gray"}
            className="animate-pulse"
          />
        </div>
      </div>
    )
  }

  if (mappedData?.length < 1) {
    return (
      <div className="w-full rounded-3xl border border-border/60 bg-background/70 p-5 shadow-xs backdrop-blur-md sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/70">
              Account activity
            </p>
            <h2 className="mt-1 text-xl font-semibold text-foreground">Payments</h2>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-greenPrimary/10">
            <Banknote
              size={23}
              className="text-greenPrimary"
            />
          </div>
        </div>
        <div className="mt-8 rounded-2xl border border-dashed border-border bg-secondary/45 px-5 py-6 text-center">
          <p className="text-base font-semibold text-foreground">
            {admin ? "No agent payments recorded yet" : "No payments recorded yet"}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {admin
              ? "Payment activity from agents will appear here over the last six months."
              : "Your payment activity will appear here once a payment has been made."}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-96 rounded-3xl border border-border/60 bg-background/70 p-5 pb-10 shadow-sm backdrop-blur-md sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/70">
            Account activity
          </p>
          <h2 className="mt-1 text-xl font-semibold text-foreground">Payments - Last 6 Months</h2>
        </div>
        <Banknote
          className="text-primary/70"
          size={23}
        />
      </div>
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <AreaChart
          data={mappedData}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient
              id="colorAmount"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor="yellow"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="yellow"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            tick={{ fill: `${darkMode ? "white" : "#555"}`, fontSize: 16 }}
            dataKey="month"
          />
          <YAxis
            stroke="#555"
            tick={{ fill: `${darkMode ? "white" : "#555"}`, fontSize: 16 }}
            tickLine={{ stroke: "#aaa" }}
            tickFormatter={(value) => `₦${value / 1000}k`}
          />
          <Tooltip
            contentStyle={{
              background: `${darkMode ? "#2B2B2B" : "#fff"}`,
              color: `${darkMode ? "#fff" : "#111"}`,
            }}
            formatter={(value: number) => `₦${value.toLocaleString()}`}
          />
          <Area
            type="monotone"
            dataKey="Amount"
            stroke={`${darkMode ? "white" : "#555"}`}
            fillOpacity={1}
            fill="rgba(242,152,41,0.8)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default Payments
