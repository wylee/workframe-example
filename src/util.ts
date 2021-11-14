export function formatDateTime(date: string | Date): string {
  if (typeof date === "string") {
    date = new Date(date);
  }
  return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
}
