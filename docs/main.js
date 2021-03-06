import { isWebShareSupported } from 'https://unpkg.com/@georapbox/web-share-element/dist/is-web-share-supported.min.js';
import { WebShare } from 'https://unpkg.com/@georapbox/web-share-element/dist/web-share.min.js';

WebShare.defineCustomElement();

const $console = document.getElementById('console');
const $webShareEl = document.querySelector('web-share');
const $form = document.forms['props-form'];

$form.shareUrl.value = $webShareEl.shareUrl = window.location.href;
$form.shareTitle.value = $webShareEl.shareTitle = 'This is a title';
$form.shareText.value = $webShareEl.shareText = 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.';

$form.addEventListener('input', evt => {
  const t = evt.target;

  switch (t.name) {
    case 'shareUrl':
    case 'shareTitle':
    case 'shareText':
      $webShareEl[t.name] = t.value;
      break;
    case 'shareFiles':
      $webShareEl.shareFiles = [...t.files];
      break;
  }
});

document.addEventListener('web-share:click', evt => {
  console.log('web-share:click -> ', evt);
  $console.innerHTML += `<div>$ <span class="info">web-share:click</span> -> Button clicked</div>`;
});

document.addEventListener('web-share:success', evt => {
  console.log('web-share:success -> ', evt.detail);
  $console.innerHTML += `<div>$ <span class="success">web-share:success</span> -> Share was successful</div>`;
});

document.addEventListener('web-share:error', evt => {
  console.log('web-share:error -> ', evt.detail);
  $console.innerHTML += `<div>$ <span class="error">web-share:error</span> -> ${evt.detail.error.name}: ${evt.detail.error.message}</div>`;
});

document.addEventListener('web-share:abort', () => {
  console.log('web-share:abort', 'Share is aborted');
  $console.innerHTML += `<div>$ <span class="warning">web-share:abort</span> -> Share is aborted</div>`;
});

if (!isWebShareSupported()) {
  const errorPlaceholder = document.querySelector('.not-supported-error');
  errorPlaceholder.hidden = false;
  errorPlaceholder.textContent = 'Web Share API is not supported by your browser.';
}
