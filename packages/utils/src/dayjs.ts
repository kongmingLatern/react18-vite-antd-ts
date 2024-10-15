import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.locale('zh-cn')

export const formatDate = (date: string | number | Date, format: string = 'YYYY-MM-DD'): string => {
  return dayjs(date).format(format);
};

export const getRelativeTime = (date: string | number | Date): string => {
  return dayjs(date).fromNow();
};

export const addDays = (date: string | number | Date, days: number): Date => {
  return dayjs(date).add(days, 'day').toDate();
};

export const subtractDays = (date: string | number | Date, days: number): Date => {
  return dayjs(date).subtract(days, 'day').toDate();
};

export const isSameDay = (date1: string | number | Date, date2: string | number | Date): boolean => {
  return dayjs(date1).isSame(dayjs(date2), 'day');
};

export const getStartOfDay = (date: string | number | Date): Date => {
  return dayjs(date).startOf('day').toDate();
};

export const getEndOfDay = (date: string | number | Date): Date => {
  return dayjs(date).endOf('day').toDate();
};

export { dayjs };

