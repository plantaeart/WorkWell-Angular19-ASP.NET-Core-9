/**
 * Converts a time string in HH:mm format to a Date object.
 * @param time - The time string in HH:mm format.
 * @returns A Date object with the time set to the provided hours and minutes.
 * @throws Error if the input is not a valid HH:mm string.
 */
export function convertTimeStringToDate(time: string): Date {
  if (typeof time !== 'string') {
    throw new Error(
      `Invalid time format: expected a string, but got ${typeof time}`
    );
  }

  const [hours, minutes] = time.split(':').map(Number);

  if (isNaN(hours) || isNaN(minutes)) {
    throw new Error(`Invalid time format: "${time}" is not in HH:mm format`);
  }

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

/**
 * Converts a Date object to a time string in HH:mm format.
 * @param date - The Date object to convert.
 * @returns A string in HH:mm format.
 */
export function formatDateToHHmm(date: Date): string {
  if (!(date instanceof Date)) {
    throw new Error(
      `Invalid date format: expected a Date object, but got ${typeof date}`
    );
  }

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}
