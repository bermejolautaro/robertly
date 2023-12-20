import ***REMOVED*** Injectable ***REMOVED*** from '@angular/core';

import ***REMOVED*** DATE_FORMATS ***REMOVED*** from '@models/constants';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import isoWeek from 'dayjs/plugin/isoWeek';
import 'dayjs/locale/es-mx';

@Injectable(***REMOVED***
  providedIn: 'root',
***REMOVED***)
export class DayjsService ***REMOVED***
  private readonly dayjs;

  public constructor() ***REMOVED***
    this.dayjs = dayjs;
    this.dayjs.extend(customParseFormat);
    this.dayjs.extend(weekOfYear);
    this.dayjs.extend(isoWeek);
    this.dayjs.locale('es-mx');
***REMOVED***

  get instance() ***REMOVED***
    return this.dayjs;
***REMOVED***

  public parseAndCompare(dateA: string, dateB: string): -1 | 0 | 1 ***REMOVED***
    return this.parseDate(dateA).isBefore(this.parseDate(dateB)) ? 1 : -1;
***REMOVED***

  public parseDate(date: string) ***REMOVED***
    return this.instance(date, [...DATE_FORMATS]);
***REMOVED***
***REMOVED***
