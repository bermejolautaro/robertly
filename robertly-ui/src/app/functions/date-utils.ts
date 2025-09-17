export function getWeekOfMonth(date: Date): number {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const firstDayOfWeek = firstDay.getDay();
  
  const daysFromPrevSunday = date.getDate() + firstDayOfWeek - 1;
  
  return Math.ceil(daysFromPrevSunday / 7);
}