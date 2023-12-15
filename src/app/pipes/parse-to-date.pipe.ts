import ***REMOVED*** TitleCasePipe ***REMOVED*** from '@angular/common';
import ***REMOVED*** Pipe, PipeTransform, inject ***REMOVED*** from '@angular/core';
import ***REMOVED*** DayjsService ***REMOVED*** from '@services/dayjs.service';

@Pipe(***REMOVED*** name: 'parseToDate', standalone: true ***REMOVED***)
export class ParseToDatePipe implements PipeTransform ***REMOVED***
  private readonly dayjsService = inject(DayjsService);
  private readonly titleCasePipe = inject(TitleCasePipe)

  public transform(value: string | null | undefined, defaultValue: string = 'Invalid Date'): string ***REMOVED***
    const parsedDate = this.dayjsService.parseDate(value ?? '');

    if (!parsedDate.isValid()) ***REMOVED***
      return defaultValue;
***REMOVED***

    return this.titleCasePipe.transform(parsedDate.format('dddd[ - ]DD/MM/YYYY'));
***REMOVED***
***REMOVED***
