import ***REMOVED*** DATE_FORMATS ***REMOVED*** from '@models/constants';
import dayjs from 'dayjs';

export function parseAndCompare(dateA: string, dateB: string): -1 | 0 | 1 ***REMOVED***
  return parseDate(dateA).isBefore(parseDate(dateB)) ? 1 : -1;
***REMOVED***

export function parseDate(date: string) ***REMOVED***
  return dayjs(date, [...DATE_FORMATS]);
***REMOVED***
