import { TitleCasePipe } from '@angular/common';
import { Pipe, PipeTransform, inject } from '@angular/core';
import { DayjsService } from '@services/dayjs.service';

@Pipe({ name: 'parseToDate', standalone: true })
export class ParseToDatePipe implements PipeTransform {
  private readonly dayjsService = inject(DayjsService);
  private readonly titleCasePipe = inject(TitleCasePipe)

  public transform(value: string | null | undefined, defaultValue: string = 'Invalid Date'): string {
    const parsedDate = this.dayjsService.parseDate(value ?? '');

    if (!parsedDate.isValid()) {
      return defaultValue;
    }

    return this.titleCasePipe.transform(parsedDate.format('dddd[ - ]DD/MM/YYYY'));
  }
}
