// @ts-check

/**
 * Check if Web Share API is supported by the platform.
 *
 * @param {import('./web-share').ShareData} [options]
 * @returns {boolean} Returns `true` if Web Share API is supported; otherwise `false`.
 */
function isWebShareSupported(options) {
  if (options !== null && typeof options === 'object') {
    return 'share' in navigator && 'canShare' in navigator && navigator.canShare(options);
  }

  return 'share' in navigator;
}

export { isWebShareSupported };
