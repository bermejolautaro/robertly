import ***REMOVED*** TitleCasePipe ***REMOVED*** from '@angular/common';
import ***REMOVED*** Pipe, PipeTransform, inject ***REMOVED*** from '@angular/core';
import ***REMOVED*** DayjsService ***REMOVED*** from '@services/dayjs.service';

@Pipe(***REMOVED*** name: 'parseToYear', standalone: true ***REMOVED***)
export class ParseToYearPipe implements PipeTransform ***REMOVED***
  private readonly dayjsService = inject(DayjsService);
  private readonly titleCasePipe = inject(TitleCasePipe);

  public transform(value: string): string ***REMOVED***
    return this.titleCasePipe.transform(this.dayjsService.parseDate(value).format('YYYY'));
***REMOVED***
***REMOVED***
