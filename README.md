[![npm version](https://img.shields.io/npm/v/@georapbox/web-share-element.svg)](https://www.npmjs.com/package/@georapbox/web-share-element)
[![npm license](https://img.shields.io/npm/l/@georapbox/web-share-element.svg)](https://www.npmjs.com/package/@georapbox/web-share-element)

[demo]: https://georapbox.github.io/web-share-element/
[support]: https://caniuse.com/#feat=custom-elementsv1
[polyfill]: https://github.com/webcomponents/polyfills/tree/master/packages/custom-elements
[license]: https://georapbox.mit-license.org/@2022
[changelog]: https://github.com/georapbox/web-share-element/blob/main/CHANGELOG.md

# &lt;web-share&gt;

A custom element that implements the [Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share) to share user-defined data.

[API documentation](#api) &bull; [Demo][demo]

## Install

```sh
$ npm install --save @georapbox/web-share-element
```

## Usage

### Script

```js
import { WebShare } from './node_modules/@georapbox/web-share-element/dist/web-share.js';

// Manually define the element.
WebShare.defineCustomElement();
```

Alternatively, you can import the automatically defined custom element.

```js
import './node_modules/@georapbox/web-share-element/dist/web-share-defined.js';
```

### Markup

```html
<web-share 
  share-url="https://developer.mozilla.org" 
  share-title="MDN" 
  share-text="Learn web development on MDN!"
></web-share>
```

### Style

By default, the component is style-free to remain as less opinionated as possible. However, you can style the various elements of the component using the `::part()` CSS pseudo-elements provided for this purpose. Below are demonstrated all available parts for styling.

```css
web-share::part(button) {
  /* The button element */
}

web-share::part(button button--disabled) {
  /* the button element - disabled state */
}
```

## API

### Properties
| Name | Reflects | Type | Default | Description |
| ---- | -------- | ---- | ------- | ----------- |
| `shareUrl`<br>*`share-url`* | ✓ | String | `''` | A string representing a URL to be shared. |
| `shareTitle`<br>*`share-title`* | ✓ | String | `''` | A string representing a title to be shared. |
| `shareText`<br>*`share-text`* | ✓ | String | `''` | A string representing text to be shared. |
| `shareFiles` | - | Array | `null` | An array of [File](https://developer.mozilla.org/en-US/docs/Web/API/File) objects representing files to be shared. this property will be omitted if the device does not support sharing files or a file type is not shareable and it will try to share the rest of the properties. Check [here](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share#shareable_file_types) for shareable file types. |
| `disabled` | ✓ | Boolean | `false` | Defines if the share button is disabled. |

### Slots

| Name | Description |
| ---- | ----------- |
| `button` | Override the share button with another element of your preference. Example: `<a href="#" slot="button" role="button">Share this page</a>` |
| `button-content` | Override the share button's content with content of your preference. Useful if all you need is to change the button's label. Example: `<span slot="button-content">Share this page</span>` |

### CSS Parts

| Name | Description |
| ---- | ----------- |
| `button` | The share button. |
| `button--disabled` | The share button when is disabled. |

### Methods

| Name | Type | Description | Arguments |
| ---- | ---- | ----------- | --------- |
| `defineCustomElement` | Static | Defines/registers the custom element with the name provided. If no name is provided, the default name is used. The method checks if the element is already defined, hence will skip trying to redefine it. | `elementName='web-share'` |
| `share` | Instance | Shares the shareable data taken from the element's properties. | - |

### Events

| Name | Description | Event Detail |
| ---- | ----------- | ------------ |
| `web-share:success` | Emitted when share is successful. | `{ shareData: { url?: String, title?: String, text?: String, files?: File[] } }` |
| `web-share:abort` | Emitted when share is aborted. | - |
| `web-share:error` | Emitted when share fails for any reason. Here is a [full list of possible exceptions](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share#exceptions). | `{ error: TypeError }` |

## Utilities

```js
isWebShareSupported()
```

Returns `true` if Web Share API is supported by the platform, otherwise returns `false`. By default, it checks if `navigator.share` is supported. If you want to check for support of a specific shareable data type, you can pass an object as argument with the shareable data you want to check for support. For example, if you want to check if sharing files is supported, you can pass `{files: [File, ...]}` as argument.

```js
isWebShareSupported({ 
  files: [new File(['foo'], 'foo.txt', { type: 'text/plain', })]
});
```

also check if certain  can be shared, you can pass `{files: [File, ...]}` as argument. The `files` property needs to be an array of `File` objects.

> NOTE: You don't necessarily need to check for Web Share API support. The component handles errors regarding support internally; you can catch them by registering the `web-share:error` event. The utility might come handy for a scenario that you want to dynamically import the custom element only if the API is supported (check example below). In cases that the Web Share API is partially supported, (eg Firefox in Android supports sharing `url`, `text` and `title` but not `files` yet), the component will try to share the other shareable data if provided and will omit any files the user is trying to share.

```js
import { isWebShareSupported } from './node_modules/@georapbox/web-share-element/dist/is-web-share-supported.js';

// Check if Web Share API is supported
if (isWebShareSupported()) {
  // Import component dynamically...
  const { WebShare } = await import('./node_modules/@georapbox/web-share-element/dist/web-share.js');

  WebShare.defineCustomElement();
}
```

## Example

Below is a full usage example, with custom configuration and styling. Check the [demo page][demo] for a demonstration.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>web-share-element demo</title>
  <style>
     web-share:not(:defined) {
      display: none;
    }

    web-share {
      display: block;
      margin-bottom: 1rem;
    }

    web-share::part(button) {
      background-color: #1a73e8;
      color: #ffffff;
      border: 0;
      padding: 0.375rem 0.75rem;
      border-radius: 0.25rem;
      font-size: 1rem;
      cursor: pointer;
      -webkit-appearance: none;
      -moz-appearance: none;
    }

    web-share::part(button button--disabled) {
      opacity: 0.5;
      cursor: not-allowed;
    }
  </style>
</head>
<body>
  <web-share>
    <span slot="button-content">Share this page</span>
  </web-share>

  <script type="module">
    import { WebShare } from './node_modules/@georapbox/web-share-element/dist/web-share.js';

    WebShare.defineCustomElement();

    const webShareElement = document.querySelector('web-share');

    webShareElement.shareUrl = window.location.href;
    webShareElement.shareTitle = document.title;
    webShareElement.shareText = document.querySelector('meta[name="description"]').content;
    webShareElement.shareFiles = [new File(['foo'], 'foo.txt', { type: 'text/plain', })];
  </script>
</body>
</html>
```

## Changelog

For API updates and breaking changes, check the [CHANGELOG][changelog].

## Browser support

Browsers without native [custom element support][support] require a [polyfill][polyfill].

- Firefox
- Chrome
- Microsoft Edge
- Safari

## License

[The MIT License (MIT)][license]
