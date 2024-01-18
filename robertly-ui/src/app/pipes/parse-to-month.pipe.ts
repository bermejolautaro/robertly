import { TitleCasePipe } from '@angular/common';
import { Pipe, PipeTransform, inject } from '@angular/core';
import { DayjsService } from '@services/dayjs.service';

@Pipe({ name: 'parseToMonth', standalone: true })
export class ParseToMonthPipe implements PipeTransform {
  private readonly dayjsService = inject(DayjsService);
  private readonly titleCasePipe = inject(TitleCasePipe);

  public transform(value: string | null | undefined, defaultValue: string = 'Invalid Month'): string {
    const parsedDate = this.dayjsService.parseDate(value ?? '');

    if (!parsedDate.isValid()) {
      return defaultValue;
    }

    return this.titleCasePipe.transform(parsedDate.format('MMMM[ - ]YYYY'));
  }
}
