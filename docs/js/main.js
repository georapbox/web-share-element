import '../lib/browser-window.js';

const url = window.location.href;
const isLocalhost = url.includes('127.0.0.1') || url.includes('localhost');
const componentUrl = isLocalhost ? '../../dist/web-share.js' : '../lib/web-share.js';
const utilUrl = isLocalhost ? '../../dist/is-web-share-supported.js' : '../lib/is-web-share-supported.js';
const { WebShare } = await import(componentUrl);
const { isWebShareSupported } = await import(utilUrl);
const errorDialog = document.querySelector('#share-error-dialog');
const errorPlaceholder = document.querySelector('#share-error-message');
const webShareEl = document.querySelector('web-share');

WebShare.defineCustomElement();

if (!isWebShareSupported()) {
  const errorPlaceholder = document.querySelector('.not-supported-error');
  errorPlaceholder.hidden = false;
}

const handleEvents = evt => {
  evt.detail ? console.log(evt.type, evt.detail) : console.log(evt.type);

  if (evt.type === 'web-share:error') {
    errorPlaceholder.textContent = evt.detail.error?.message || 'Unknown error occurred.';
    errorDialog.showModal();
  }
};

webShareEl.addEventListener('web-share:success', handleEvents);
webShareEl.addEventListener('web-share:error', handleEvents);
webShareEl.addEventListener('web-share:abort', handleEvents);

webShareEl.shareFiles = [
  new File(['file content'], 'file-1.txt', { type: 'text/plain' }),
  new File(['file content'], 'file-2.txt', { type: 'text/plain' })
];

errorDialog.addEventListener('click', evt => {
  if (evt.target === evt.currentTarget) {
    errorDialog.close();
  }
});
