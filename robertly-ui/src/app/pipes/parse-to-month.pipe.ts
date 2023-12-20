import ***REMOVED*** TitleCasePipe ***REMOVED*** from '@angular/common';
import ***REMOVED*** Pipe, PipeTransform, inject ***REMOVED*** from '@angular/core';
import ***REMOVED*** DayjsService ***REMOVED*** from '@services/dayjs.service';

@Pipe(***REMOVED*** name: 'parseToMonth', standalone: true ***REMOVED***)
export class ParseToMonthPipe implements PipeTransform ***REMOVED***
  private readonly dayjsService = inject(DayjsService);
  private readonly titleCasePipe = inject(TitleCasePipe);

  public transform(value: string | null | undefined, defaultValue: string = 'Invalid Month'): string ***REMOVED***
    const parsedDate = this.dayjsService.parseDate(value ?? '');

    if (!parsedDate.isValid()) ***REMOVED***
      return defaultValue;
***REMOVED***

    return this.titleCasePipe.transform(parsedDate.format('MMMM[ - ]YYYY'));
***REMOVED***
***REMOVED***
