import ***REMOVED*** Pipe, PipeTransform ***REMOVED*** from "@angular/core";

@Pipe(***REMOVED*** name: 'ifNullEmptyArray', standalone: true ***REMOVED***)
export class IfNullEmptyArrayPipe<T> implements PipeTransform ***REMOVED***
  transform(value: T[] | null): T[] ***REMOVED***
    return value ?? [];
***REMOVED***
***REMOVED***

