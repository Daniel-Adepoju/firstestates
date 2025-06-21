import dayjs, { Dayjs } from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime';
import customParseFormat from 'dayjs/plugin/customParseFormat'
import duration from 'dayjs/plugin/duration'

dayjs.extend(relativeTime)
dayjs.extend(customParseFormat)
dayjs.extend(duration)

const date = dayjs()
const now = new Date()

export const getDate = (sub = 0) => {
 return date.subtract(sub, 'day').format('YYYY-MM-DD')
  }

  export const parseDate = (date) => {
    return dayjs(date).format('YYYY-MM-DD')
  }

  export const createdAt = (createdAt,onlyNum) => {
    if (onlyNum) {
   return dayjs().diff(dayjs(createdAt), 'day')
    }
  return dayjs(createdAt).fromNow()
  }

  export const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

