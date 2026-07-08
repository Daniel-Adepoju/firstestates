import dayjs, { Dayjs } from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import customParseFormat from "dayjs/plugin/customParseFormat"
import duration from "dayjs/plugin/duration"
import isToday from "dayjs/plugin/isToday"
import isYesterday from "dayjs/plugin/isYesterday"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"

dayjs.extend(isToday)
dayjs.extend(isYesterday)
dayjs.extend(relativeTime)
dayjs.extend(customParseFormat)
dayjs.extend(duration)
dayjs.extend(utc)
dayjs.extend(timezone)

const date = dayjs()
const now = new Date()

export const getDate = (sub = 0) => {
  return date.subtract(sub, "day").format("YYYY-MM-DD")
}

export const parseDate = (date: any) => {
  return dayjs(date).tz("Africa/Lagos").format("YYYY-MM-DD")
}

export const createdAt = (createdAt: any, onlyNum=false) => {
  if (onlyNum) {
    return dayjs().diff(dayjs(createdAt), "day")
  }
  return dayjs(createdAt).fromNow()
}

export const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

export const inMinutes = (minutes: any) => {
  const now = new Date()
  return new Date(now.getTime() + minutes * 60 * 1000)
}

export const daysLeft = (date: any) => {
  const now = dayjs().tz("Africa/Lagos").format("YYYY-MM-DD")
  const end = dayjs(date)
  const diff = end.diff(now, "day")
  return diff > 0 ? diff : 0
}

// For Chat Section

export const groupMessagesByDate = (messages: any[]) => {
  const groups: {
    date: string
    messages: any[]
  }[] = []

  let currentLabel = ""

  for (const message of messages) {
    const date = dayjs(message.createdAt)

    const label = date.isToday()
      ? "Today"
      : date.isYesterday()
        ? "Yesterday"
        : date.format("MMMM D, YYYY")

    if (label !== currentLabel) {
      groups.push({
        date: label,
        messages: [],
      })

      currentLabel = label
    }

    groups[groups.length - 1].messages.push(message)
  }

  return groups.reverse()
}
