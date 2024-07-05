import {
    startOfHour,
    startOfDay,
    startOfWeek,
    startOfMonth,
    addHours,
    addDays,
    addWeeks,
    addMonths,
  } from 'date-fns';
  
  export type TimeUnit =
    | 'hour'
    | 'hour-1'
    | 'hour-2'
    | 'hour-3'
    | 'hour-6'
    | 'day'
    | 'week'
    | 'month';
  
  export const MILLISECOND = 1;
  export const SECOND = MILLISECOND * 1000;
  export const MINUTE = SECOND * 60;
  export const HOUR = MINUTE * 60;
  export const DAY = HOUR * 24;
  export const WEEK = DAY * 7;
  
  export const getTimeUnitInMilliseconds = (unit: TimeUnit): number => {
    switch (unit) {
      case 'hour':
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
      case 'hour-1':
        return startOfHour(date);
      case 'hour-2':
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), Math.floor(date.getHours() / 2) * 2);
      case 'hour-3':
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), Math.floor(date.getHours() / 3) * 3);
      case 'hour-6':
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), Math.floor(date.getHours() / 6) * 6);
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
    const roundedDown = roundDown(time, unit);
    if (roundedDown.getTime() === time.getTime()) {
      return time;
    }
    return new Date(roundedDown.getTime() + getTimeUnitInMilliseconds(unit));
  };
  
  export const getTimeMarksOfInterval = (startTime: Date, endTime: Date, unit: TimeUnit): Date[] => {
    const timeMarks: Date[] = [];
    let time = roundDown(startTime, unit);
    while (time < endTime) {
      timeMarks.push(new Date(time));
      switch (unit) {
        case 'hour':
        case 'hour-1':
          time = addHours(time, 1);
          break;
        case 'hour-2':
          time = addHours(time, 2);
          break;
        case 'hour-3':
          time = addHours(time, 3);
          break;
        case 'hour-6':
          time = addHours(time, 6);
          break;
        case 'day':
          time = addDays(time, 1);
          break;
        case 'week':
          time = addWeeks(time, 1);
          break;
        case 'month':
          time = addMonths(time, 1);
          break;
      }
    }
    return timeMarks;
  };
  