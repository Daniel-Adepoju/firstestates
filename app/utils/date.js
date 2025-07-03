import dayjs, { Dayjs } from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime';
import customParseFormat from 'dayjs/plugin/customParseFormat'
import duration from 'dayjs/plugin/duration'
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';

dayjs.extend(isToday);
dayjs.extend(isYesterday);
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

  // For Chat Section

export const groupMessagesByDate = (messages) => {
  const groupedMessages = {};
 
  messages.forEach((msg) => {
    const date = dayjs(msg.createdAt)
      let label
    if (date.isToday()) {
      label = 'Today'
    } else if (date.isYesterday()) {
      label = 'Yesterday'
    } else {
      label = date.format('MMMM D, YYYY')
    }
    if (!groupedMessages[label]) {
      groupedMessages[label] = [];
    }
    groupedMessages[label].push(msg);
  });
  return groupedMessages;
}