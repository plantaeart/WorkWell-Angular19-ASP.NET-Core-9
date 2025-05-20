/**
 * Converts a time string in HH:mm format to a Date object.
 * @param time - The time string in HH:mm format.
 * @returns A Date object with the time set to the provided hours and minutes.
 * @throws Error if the input is not a valid HH:mm string.
 */
export function convertTimeStringToDate(time: string): Date {
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

// convert any into Date
export function convertIntoDate(time: any): Date {
  if (typeof time === 'string') {
    return convertTimeStringToDate(time);
  } else if (time instanceof Date) {
    return time;
  } else {
    throw new Error('Invalid date format');
  }
}

/**
 * Converts a Date object to a time string in HH:mm format.
 * @param date - The Date object to convert.
 * @returns A string in HH:mm format.
 */
export function formatDateToHHmm(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}
