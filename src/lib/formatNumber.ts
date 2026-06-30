export function formatNumber(value: number, decimals: number = 0): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatHours(hours: number | null | undefined): string {
  if (hours === null || hours === undefined) return '0 hrs';
  const rounded = Math.round(hours * 10) / 10;
  return `${rounded} hr${rounded !== 1 ? 's' : ''}`;
}
