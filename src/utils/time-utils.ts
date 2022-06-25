import { DateTime } from 'luxon';

export const getTimestampNow = () => {
  return DateTime.now().toMillis();
};

export const getTimestampOfTwoWeeksAgo = () => {
  return DateTime.local().minus({ weeks: 2 }).toMillis();
};
