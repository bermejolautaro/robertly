import { inject, Injectable } from '@angular/core';

import { DATE_FORMATS } from '@models/constants';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import isoWeek from 'dayjs/plugin/isoWeek';
import 'dayjs/locale/es-mx';
import { DAY_JS } from 'src/main';

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

  public parseDate(date: string) {
    return this.instance(date, [...DATE_FORMATS]);
  }
}

export function parseDate(date: string) {
  const dayjs = inject(DAY_JS);
  return dayjs(date, [...DATE_FORMATS]);
}