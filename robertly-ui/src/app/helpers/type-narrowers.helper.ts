export function isHtmlInputElement(value: unknown | null): value is HTMLInputElement {
  return (value as HTMLInputElement)?.checked;
}