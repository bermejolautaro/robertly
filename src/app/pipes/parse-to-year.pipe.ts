import { TitleCasePipe } from '@angular/common';
import { Pipe, PipeTransform, inject } from '@angular/core';
import { DayjsService } from '@services/dayjs.service';

@Pipe({ name: 'parseToYear', standalone: true })
export class ParseToYearPipe implements PipeTransform {
  private readonly dayjsService = inject(DayjsService);
  private readonly titleCasePipe = inject(TitleCasePipe);

  public transform(value: string): string {
    return this.titleCasePipe.transform(this.dayjsService.parseDate(value).format('YYYY'));
  }
}
