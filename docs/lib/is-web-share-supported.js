function a(a={}){return a={files:null,...a},Array.isArray(a.files)?"share"in navigator&&"canShare"in navigator&&navigator.canShare(a.files):"share"in navigator}export{a as isWebShareSupported};
//# sourceMappingURL=is-web-share-supported.js.map
