import ***REMOVED*** Pipe, PipeTransform ***REMOVED*** from '@angular/core';
import ***REMOVED*** parseDate ***REMOVED*** from '@helpers/date.helper';

@Pipe(***REMOVED*** name: 'parseToMonth', standalone: true ***REMOVED***)
export class ParseToMonthPipe implements PipeTransform ***REMOVED***
  public transform(value: string | null | undefined, defaultValue: string): string ***REMOVED***
    const parsedDate = parseDate(value ?? '');

    if (!parsedDate.isValid()) ***REMOVED***
      return defaultValue;
***REMOVED***

    return parsedDate.format('MMMM[ - ]YYYY');
***REMOVED***
***REMOVED***
