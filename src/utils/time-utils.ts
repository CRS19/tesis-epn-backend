import { DateTime } from 'luxon';

export const getTimestampNow = () => {
  return DateTime.now().toMillis();
};
