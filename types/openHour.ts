export type OpenHour = string & { __brand: 'OpenHour' };

export function createOpenHour(value: string): OpenHour {
  if (!/^\d{2}:\d{2}-\d{2}:\d{2}$/.test(value)) {
    throw new Error("Invalid OpenHour format. Expected 'HH:MM-HH:MM'");
  }
  return value as OpenHour;
}

export function getOpenTime(hour: OpenHour): string {
  return hour.split('-')[0];
}

export function getCloseTime(hour: OpenHour): string {
  return hour.split('-')[1];
}
