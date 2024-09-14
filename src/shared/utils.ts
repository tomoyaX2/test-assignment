import * as crypto from 'crypto';

export const generateRandomString = (length = 6) => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  return result;
};

export const minutesToMilliseconds = (minutes: number) => {
  return minutes * 60 * 1000;
};

export const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

export const addMinutes = (date: Date, minutes: number) => {
  return new Date(date.getTime() + minutes * 60000);
};

export const subtractDays = (date: Date, days: number) => {
  return new Date(date.getTime() - days * 24 * 60 * 60 * 1000);
};
