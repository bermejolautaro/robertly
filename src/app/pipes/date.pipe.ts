import ***REMOVED*** Pipe, PipeTransform ***REMOVED*** from '@angular/core';
import dayjs from 'dayjs';

@Pipe(***REMOVED*** name: 'parseToMonth', standalone: true ***REMOVED***)
export class ParseToMonthPipe implements PipeTransform ***REMOVED***
  public transform(value: string): string ***REMOVED***
    return dayjs(value, 'DD/MM/YYYY').format('MMMM[ - ]YYYY');
***REMOVED***
***REMOVED***
