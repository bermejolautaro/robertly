import { getWeekOfMonth } from 'src/app/functions/date-utils';

describe('getWeekOfMonth', () => {
  it('should return the correct week of the month', () => {
    const result1 = getWeekOfMonth(new Date(2025, 9 - 1, 1));
    const result2 = getWeekOfMonth(new Date(2025, 9 - 1, 14));
    const result3 = getWeekOfMonth(new Date(2025, 9 - 1, 16));
    const result4 = getWeekOfMonth(new Date(2025, 5 - 1, 17));
    const result5 = getWeekOfMonth(new Date(2025, 3 - 1, 31));

    expect(result1).toBe(1);
    expect(result2).toBe(2);
    expect(result3).toBe(3);
    expect(result4).toBe(3);
    expect(result5).toBe(6);
  })
});

