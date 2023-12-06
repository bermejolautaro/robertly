import ***REMOVED*** Pipe, PipeTransform ***REMOVED*** from '@angular/core';
import ***REMOVED*** parseDate ***REMOVED*** from '@helpers/date.helper';

@Pipe(***REMOVED*** name: 'parseToYear', standalone: true ***REMOVED***)
export class ParseToYearPipe implements PipeTransform ***REMOVED***
  public transform(value: string): string ***REMOVED***
    return parseDate(value).format('YYYY');
***REMOVED***
***REMOVED***
