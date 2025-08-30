import { TitleCasePipe } from '@angular/common';
import { Pipe, PipeTransform, inject } from '@angular/core';
import { DATE_FORMATS } from '@models/constants';
import { DAY_JS } from 'src/main';

@Pipe({ name: 'parseToDate', standalone: true })
export class ParseToDatePipe implements PipeTransform {
  private readonly dayjs = inject(DAY_JS);
  private readonly titleCasePipe = inject(TitleCasePipe)

  public transform(value: string | null | undefined, defaultValue: string = 'Invalid Date'): string {
    const parsedDate = this.dayjs(value ?? '', [...DATE_FORMATS]);

    if (!parsedDate.isValid()) {
      return defaultValue;
    }

    return this.titleCasePipe.transform(parsedDate.format('dddd[ - ]DD/MM/YYYY'));
  }
}
