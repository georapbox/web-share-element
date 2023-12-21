import '../lib/browser-window.js';

const isLocalhost = window.location.href.includes('127.0.0.1') || window.location.href.includes('localhost');
const componentUrl = isLocalhost ? '../../dist/web-share.js' : '../lib/web-share.js';

const errorDialog = document.querySelector('#share-error-dialog');
const errorPlaceholder = document.querySelector('#share-error-message');

import(componentUrl).then(res => {
  const { WebShare } = res;

  WebShare.defineCustomElement();

  const handleEvents = evt => {
    evt.detail ? console.log(evt.type, evt.detail) : console.log(evt.type);

    if (evt.type === 'web-share:error') {
      errorPlaceholder.textContent = evt.detail.error?.message || 'Unknown error occurred.';
      errorDialog.showModal();
    }
  };

  const webShareEl = document.querySelector('web-share');

  webShareEl.addEventListener('web-share:success', handleEvents);
  webShareEl.addEventListener('web-share:error', handleEvents);
  webShareEl.addEventListener('web-share:abort', handleEvents);

  webShareEl.shareFiles = [
    new File(['file content'], 'file-1.txt', { type: 'text/plain' }),
    new File(['file content'], 'file-2.txt', { type: 'text/plain' })
  ];
}).catch(err => {
  console.error(err);
});

import(isLocalhost ? '../../dist/is-web-share-supported.js' : '../lib/is-web-share-supported.js').then(res => {
  const { isWebShareSupported } = res;

  if (!isWebShareSupported()) {
    const errorPlaceholder = document.querySelector('.not-supported-error');
    errorPlaceholder.hidden = false;
  }
}).catch(err => {
  console.error(err);
});

errorDialog.addEventListener('click', evt => {
  if (evt.target === evt.currentTarget) {
    errorDialog.close();
  }
});
