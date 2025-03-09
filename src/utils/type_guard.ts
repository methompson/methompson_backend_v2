import { DateTime } from 'luxon';
import { isString } from 'tcheck';

export type ValidDateTimeString = string;

export function isValidDateTimeString(
  input: unknown,
): input is ValidDateTimeString {
  if (!isString(input)) return false;

  const date = DateTime.fromISO(input);

  return date.isValid;
}
