/* eslint-disable radix */
export function formatDateAndDuration(isoDateString: string) {
  const DAYS_IN_MONTH = 30.436875; // Average days in a month (365.25 / 12)
  const DAYS_IN_YEAR = 365.25; // Average days in a year (365.25)

  const givenDate = new Date(isoDateString);
  const currentDate = new Date();

  // Format the given date as "Month day, year"
  const formattedDate = givenDate.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Calculate the duration between the given date and current date
  const duration = currentDate.getTime() - givenDate.getTime();
  const seconds = Math.floor(duration / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / DAYS_IN_MONTH);
  const years = Math.floor(days / DAYS_IN_YEAR);

  const actualDays = String(parseInt(String(days % DAYS_IN_MONTH)));

  // Construct the duration string
  const durationString = `${years}y - ${months % 12}m - ${actualDays.padStart(2, '0')}d`;

  return { formattedDate, durationString };
}

export function formatDateToMMDDYY(isoString: string) {
  const dateObj = new Date(isoString);

  // Extract components from the date object
  const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getUTCDate()).padStart(2, '0');
  const year = String(dateObj.getUTCFullYear());

  // Combine components to get the desired format
  const formattedDate = `${month}/${day}/${year}`;
  return formattedDate;
}
