export const setSession = (key, value) =>
  sessionStorage.setItem(key, JSON.stringify(value));
export const getSession = (key) => {
  const val = sessionStorage.getItem(key);
  try {
    return val ? JSON.parse(val) : null;
  } catch {
    return null;
  }
};
export const removeSession = (key) => sessionStorage.removeItem(key);
