import { DateTime } from 'luxon';

export const getTimestampNow = () => {
  return DateTime.now().toMillis();
};

export const getTimestampOfTwoWeeksAgo = () => {
  return DateTime.local().minus({ weeks: 2 }).toMillis();
};

// function that gets the diference between two timestamps in seconds if diference is less than a minute or minutes if diference is less than an hour or hours if diference is less than a day or days if diference is less than a month or months if diference is less than a year or years
export const getTimeDifference = (timestamp1: number, timestamp2: number) => {
  const diff = timestamp2 - timestamp1;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);
  if (seconds < 60) {
    return `${seconds} segundos`;
  }
  // istanbul ignore next
  if (diff < 60000000) {
    return `${minutes} minutos`;
  } else if (diff < 3600000000) {
    return `${hours} horas`;
  } else if (diff < 86400000000) {
    return `${days} días`;
  } else if (diff < 2678400000000) {
    return `${months} meses`;
  } else {
    return `${years} años`;
  }
};

// get date in format YYYY/MM/DD from a timestamp
export const getDateFromTimestamp = (timestamp: number) => {
  const date = DateTime.fromMillis(timestamp);
  return date.toFormat('yyyy/MM/dd');
};
