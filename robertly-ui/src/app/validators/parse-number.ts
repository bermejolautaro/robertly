export function parseNumber(value: string | null | undefined): number | null {
  if (value === '' || value === null || value === undefined) {
    return null;
  }

  if (!/^[0-9.]+$/.test(value)) {
    return null;
  }

  return Number(value);
}
