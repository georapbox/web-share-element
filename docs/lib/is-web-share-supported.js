/*!
 * @georapbox/web-share-element
 * A custom element that implements the Web Share API to share user-defined data.
 *
 * @version 3.1.1
 * @homepage https://github.com/georapbox/web-share-element#readme
 * @author George Raptis <georapbox@gmail.com>
 * @license MIT
 */
function r(a){return a!==null&&typeof a=="object"?"share"in navigator&&"canShare"in navigator&&navigator.canShare(a):"share"in navigator}export{r as isWebShareSupported};
