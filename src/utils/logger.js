
const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  log: (...args) => {
    if (isDevelopment) {
      }
  },
  warn: (...args) => {
    if (isDevelopment) {
      }
  },
  error: (...args) => {
    if (isDevelopment) {
      console.error(...args);
    }
  },
  info: (...args) => {
    if (isDevelopment) {
      }
  }
};

export default logger; 