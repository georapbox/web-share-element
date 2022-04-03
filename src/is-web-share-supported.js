/**
 * Check if Web Share API is supported by the platform.
 *
 * @param {Object} [options={}]
 * @param {Boolean} [options.files] Optional. An array of Files in order to check if files can be shared.
 * @returns {Boolean} Returns `true` if Web Share API is supported; otherwise `false`.
 */
function isWebShareSupported(options = {}) {
  const defaults = { files: null };
  options = { ...defaults, ...options };

  if (Array.isArray(options.files)) {
    return 'share' in navigator && 'canShare' in navigator && navigator.canShare(options.files);
  }

  return 'share' in navigator;
}

export { isWebShareSupported };
