import { Injectable } from '@angular/core';

import { DATE_FORMATS } from '@models/constants';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import isoWeek from 'dayjs/plugin/isoWeek';
import 'dayjs/locale/es-mx';

@Injectable({
  providedIn: 'root',
})
export class DayjsService {
  private readonly dayjs;

  public constructor() {
    this.dayjs = dayjs;
    this.dayjs.extend(customParseFormat);
    this.dayjs.extend(weekOfYear);
    this.dayjs.extend(isoWeek);
    this.dayjs.locale('es-mx');
  }

  get instance() {
    return this.dayjs;
  }

  public parseAndCompare(dateA: string, dateB: string): -1 | 0 | 1 {
    return this.parseDate(dateA).isBefore(this.parseDate(dateB)) ? 1 : -1;
  }

  public parseDate(date: string) {
    return this.instance(date, [...DATE_FORMATS]);
  }
}
