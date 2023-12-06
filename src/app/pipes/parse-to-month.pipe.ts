import ***REMOVED*** Pipe, PipeTransform ***REMOVED*** from '@angular/core';
import ***REMOVED*** parseDate ***REMOVED*** from '@helpers/date.helper';

@Pipe(***REMOVED*** name: 'parseToMonth', standalone: true ***REMOVED***)
export class ParseToMonthPipe implements PipeTransform ***REMOVED***
  public transform(value: string): string ***REMOVED***
    return parseDate(value).format('MMMM[ - ]YYYY');
***REMOVED***
***REMOVED***
