import dayjs, { Dayjs } from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime';
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(relativeTime)
dayjs.extend(customParseFormat)

const date = dayjs()
const now = new Date()

export const getDate = (sub = 0) => {
 return date.subtract(sub, 'day').format('YYYY-MM-DD')
  }

  export const parseDate = (date) => {
    return dayjs(date).format('YYYY-MM-DD')
  }

