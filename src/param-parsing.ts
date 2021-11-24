import ms from "ms";

import { Dateish } from "./type-extensions";

function isDate(date: Dateish): date is Date {
  return date instanceof Date;
}

function isTimestamp(date: Dateish): date is number {
  return typeof date === "number";
}

function isString(date: Dateish): date is string {
  return typeof date === "string";
}

export const parseDelta = (delta: string) => {
  const deltaInSeconds = Number.isNaN(Number(delta))
    ? ms(delta) / 1000
    : Number(delta);
  if (!Number.isInteger(deltaInSeconds))
    throw new Error("cannot be called with a non integer value");
  if (deltaInSeconds < 0)
    throw new Error("cannot be called with a negative value");
  return deltaInSeconds;
};

const convertToTimestamp = (date: Dateish): number => {
  if (isDate(date)) {
    return Number(date) / 1000;
  } else if (isString(date)) {
    return Number.isNaN(Number(date))
      ? Number(Date.parse(date)) / 1000
      : Number(date);
  } else if (isTimestamp(date)) {
    return date;
  }
  throw new Error("type not supported");
};

export const parseDate = (date: Dateish): number => {
  const timestamp = convertToTimestamp(date);

  if (!Number.isInteger(timestamp))
    throw new Error("cannot be called with a non integer value");
  if (timestamp < 0) throw new Error("cannot be called with a negative value");
  return timestamp;
};
