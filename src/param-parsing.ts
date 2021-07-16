import ms from "ms";

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
