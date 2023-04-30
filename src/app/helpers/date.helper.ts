import * as dayjs from 'dayjs';

export function parseAndCompare(dateA: string, dateB: string): -1 | 0 | 1 {
  return dayjs(dateA, 'DD-MM-YYYY').isBefore(dayjs(dateB, 'DD-MM-YYYY')) ? 1 : -1;
}
