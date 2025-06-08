

export function formatNumber(num: number) {
  if (num >= 1_000_000_000) {
    return (Math.round(num / 1_000_000_000 * 10) / 10) + 'b';
  } else if (num >= 1_000_000) {
    return (Math.round(num / 1_000_000 * 10) / 10) + 'm';
  } else if (num >= 1_000) {
    return (Math.round(num / 1_000 * 10) / 10) + 'k';
  } else {
    return num.toString();
  }
}

