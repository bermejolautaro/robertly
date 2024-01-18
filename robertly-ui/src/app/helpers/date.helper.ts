import { DATE_FORMATS } from '@models/constants';
import dayjs from 'dayjs';

export function parseAndCompare(dateA: string, dateB: string): -1 | 0 | 1 {
  return parseDate(dateA).isBefore(parseDate(dateB)) ? 1 : -1;
}

export function parseDate(date: string) {
  return dayjs(date, [...DATE_FORMATS]);
}
