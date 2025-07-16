export const setLocal = (key, value) =>
  localStorage.setItem(key, JSON.stringify(value));
export const getLocal = (key) => {
  const val = localStorage.getItem(key);
  try {
    return val ? JSON.parse(val) : null;
  } catch {
    return null;
  }
};
export const removeLocal = (key) => localStorage.removeItem(key);
