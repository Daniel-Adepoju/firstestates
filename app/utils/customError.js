export function throwError(message, { name = 'Error', ...options } = {}) {
    const error = new Error(message);
    error.name = name;
    Object.assign(error, options);
    throw error;
  }