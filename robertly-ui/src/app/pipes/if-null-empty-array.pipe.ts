import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'ifNullEmptyArray', standalone: true })
export class IfNullEmptyArrayPipe<T> implements PipeTransform {
  transform(value: T[] | null): T[] {
    return value ?? [];
  }
}

