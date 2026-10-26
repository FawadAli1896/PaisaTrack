/**
 * Date and Week Utilities for PaisaTrack
 * Weeks are defined Monday through Sunday
 */

export function getMonday(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function formatDateISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getWeekRange(dateOffsetWeeks = 0): {
  weekKey: string;
  startDate: string;
  endDate: string;
  formattedRange: string;
  weekLabel: string;
  daysRemaining: number;
} {
  const today = new Date();
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + dateOffsetWeeks * 7);

  const monday = getMonday(targetDate);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  // Month & year
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthName = monthNames[monday.getMonth()];
  const year = monday.getFullYear();

  // Approximate week number of the month
  const firstDayOfMonth = new Date(year, monday.getMonth(), 1);
  const weekNumber = Math.ceil((monday.getDate() + firstDayOfMonth.getDay()) / 7);

  // Remaining days in week if it's the current week
  const msInDay = 24 * 60 * 60 * 1000;
  const daysDiff = Math.max(0, Math.ceil((sunday.getTime() - today.getTime()) / msInDay));

  const formatShort = (d: Date) => {
    return `${d.getDate()} ${monthNames[d.getMonth()].slice(0, 3)}`;
  };

  return {
    weekKey: `${year}-W${weekNumber}-${monday.getMonth() + 1}`,
    startDate: formatDateISO(monday),
    endDate: formatDateISO(sunday),
    formattedRange: `${formatShort(monday)} – ${formatShort(sunday)} ${year}`,
    weekLabel: `${monthName} ${year} · Week ${weekNumber}`,
    daysRemaining: dateOffsetWeeks === 0 ? Math.min(7, Math.max(0, daysDiff)) : (dateOffsetWeeks > 0 ? 7 : 0)
  };
}

export function formatCurrency(amount: number): string {
  const sign = amount < 0 ? '-' : '';
  const abs = Math.abs(amount).toLocaleString('en-US', {
    maximumFractionDigits: 0
  });
  return `${sign}Rs. ${abs}`;
}
