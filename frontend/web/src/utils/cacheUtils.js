/**
 * Utility functions to help with cache busting
 */

/**
 * Adds a timestamp parameter to a URL to bypass browser cache
 * @param {string} url - The URL to modify
 * @returns {string} - The URL with a timestamp parameter
 */
export const addTimestampToUrl = (url) => {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}t=${Date.now()}`;
};

/**
 * Returns the current timestamp as a string
 * @returns {string} - The current timestamp
 */
export const getTimestamp = () => {
  return Date.now().toString();
}; 