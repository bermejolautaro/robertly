export function isHtmlInputElement(value: unknown | null): value is HTMLInputElement ***REMOVED***
  return (value as HTMLInputElement)?.checked;
***REMOVED***