// https://github.com/otiai10/chrome-extension-es6-import
(async () => {
  const src = chrome.extension.getURL('src/js/timecard.js');
  const contentScript = await import(src);
  contentScript.main(/* chrome: no need to pass it */);
})();