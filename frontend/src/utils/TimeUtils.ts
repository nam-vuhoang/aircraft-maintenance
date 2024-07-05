import { startOfHour, startOfDay, startOfWeek, startOfMonth } from 'date-fns';

export type TimeUnit = 'hour' | 'hour-1' | 'hour-2' | 'hour-3' | 'hour-6' | 'day' | 'week' | 'month';

export const MILLISECOND = 1;
export const SECOND = MILLISECOND * 1000;
export const MINUTE = SECOND * 60;
export const HOUR = MINUTE * 60;
export const DAY = HOUR * 24;
export const WEEK = DAY * 7;

export const getTimeUnitInMilliseconds = (unit: TimeUnit): number => {
  switch (unit) {
    case 'hour':
      return HOUR;
    case 'hour-1':
      return HOUR;
    case 'hour-2':
      return 2 * HOUR;
    case 'hour-3':
      return 3 * HOUR;
    case 'hour-6':
      return 6 * HOUR;
    case 'day':
      return DAY;
    case 'week':
      return WEEK;
    case 'month':
      return 30 * DAY;
    default:
      return 0;
  }
};

export const roundDown = (time: Date, unit: TimeUnit): Date => {
  const date = new Date(time); // Create a copy of the date to avoid mutating the original

  switch (unit) {
    case 'hour':
      return startOfHour(date);
    case 'hour-1':
      return startOfHour(date);
    case 'hour-2':
      return new Date(Math.floor(date.getHours() / 2) * 2, 0, 0);
    case 'hour-3':
      return new Date(Math.floor(date.getHours() / 3) * 3, 0, 0);
    case 'hour-6':
      return new Date(Math.floor(date.getHours() / 6) * 6, 0, 0);
    case 'day':
      return startOfDay(date);
    case 'week':
      return startOfWeek(date, { weekStartsOn: 1 });
    case 'month':
      return startOfMonth(date);
    default:
      return date;
  }
};

export const roundUp = (time: Date, unit: TimeUnit): Date => {
  return roundDown(new Date(time.getTime() + getTimeUnitInMilliseconds(unit) - 1), unit);
};

export const getTimeMarksOfInterval = (startTime: Date, endTime: Date, unit: TimeUnit): Date[] => {
  const timeMarks: Date[] = [];
  let time = new Date(startTime);
  while (time < endTime) {
    timeMarks.push(new Date(time));
    time = new Date(time.getTime() + getTimeUnitInMilliseconds(unit));
    switch (unit) {
      case 'hour':
        break;
      case 'hour-1':
        time = new Date(time.getTime() + HOUR);
        break;
      case 'hour-2':
        time = new Date(time.getTime() + 2 * HOUR);
        break;
      case 'hour-3':
        time = new Date(time.getTime() + 3 * HOUR);
        break;
      case 'hour-6':
        time = new Date(time.getTime() + 6 * HOUR);
        break;
      case 'day':
        time = new Date(time.getTime() + DAY);
        break;
      case 'week':
        time = new Date(time.getTime() + WEEK);
        break;
      case 'month':
        time.setMonth(time.getMonth() + 1);
        break;
    }
  }
  return timeMarks;
};
