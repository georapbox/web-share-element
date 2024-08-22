[![npm version](https://img.shields.io/npm/v/@georapbox/web-share-element.svg)](https://www.npmjs.com/package/@georapbox/web-share-element)
[![npm license](https://img.shields.io/npm/l/@georapbox/web-share-element.svg)](https://www.npmjs.com/package/@georapbox/web-share-element)

[demo]: https://georapbox.github.io/web-share-element/
[license]: https://github.com/georapbox/web-share-element/blob/main/LICENSE
[changelog]: https://github.com/georapbox/web-share-element/blob/main/CHANGELOG.md

# &lt;web-share&gt;

A custom element that implements the [Web Share API](https://developer.mozilla.org/docs/Web/API/Navigator/share) to share user-defined data.

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

By default, the component is style-free to remain as less opinionated as possible. However, you can style the various elements of the component using [CSS Parts](#css-parts) provided for this purpose.

## API

### Properties
| Name | Reflects | Type | Default | Description |
| ---- | -------- | ---- | ------- | ----------- |
| `shareUrl`<br>*`share-url`* | ✓ | String | `''` | A string representing a URL to be shared. |
| `shareTitle`<br>*`share-title`* | ✓ | String | `''` | A string representing a title to be shared. |
| `shareText`<br>*`share-text`* | ✓ | String | `''` | A string representing text to be shared. |
| `shareFiles` | - | Array | `[]` | An array of [File](https://developer.mozilla.org/docs/Web/API/File) objects representing files to be shared. this property will be omitted if the device does not support sharing files or a file type is not shareable and it will try to share the rest of the properties. Check [here](https://developer.mozilla.org/docs/Web/API/Navigator/share#shareable_file_types) for shareable file types. |
| `disabled` | ✓ | Boolean | `false` | Determines if the share button is disabled. |

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
| `share`<sup>1</sup> | Instance | Shares the shareable data taken from the element's properties. | - |

<sup>1</sup> Instance methods are only available after the component has been defined. To ensure that the component has been defined, you can use the `whenDefined` method of the `CustomElementRegistry` interface. For example:

```js
customElements.whenDefined('web-share').then(() => {
  /* call methods here */
});
```

### Events

| Name | Description | Event Detail |
| ---- | ----------- | ------------ |
| `web-share:success` | Emitted when share is successful. | `{ shareData: { url?: String, title?: String, text?: String, files?: File[] } }` |
| `web-share:abort` | Emitted when share is aborted. | `{ error: AbortError }` |
| `web-share:error` | Emitted when share fails for any reason. Here is a [full list of possible exceptions](https://developer.mozilla.org/docs/Web/API/Navigator/share#exceptions). | `{ error: TypeError }` |

## Utilities

```js
isWebShareSupported()
```

Returns `true` if Web Share API is supported by the platform, otherwise returns `false`. By default, it checks if `navigator.share` is supported. If you want to check for support of a specific shareable data type, you can pass an object as argument with the shareable data you want to check for support. For example, if you want to check if sharing files is supported, you can pass `{files: [File, ...]}` as argument. Available shareable data types are `url`, `text`, `title` and `files`.

```js
isWebShareSupported({ 
  files: [new File(['foo'], 'foo.txt', { type: 'text/plain', })]
});
```

> NOTE: You don't necessarily need to check for Web Share API support. The component handles errors regarding support internally; you can catch them by registering the `web-share:error` event. The utility might come handy for a scenario that you want to dynamically import the custom element only if the API is supported (check example below). In cases that the Web Share API is partially supported, (eg Firefox in Android supports sharing `url` and `title` but not `text` or `files`), the component will try to share the other shareable data if provided and will omit any unsupported shareable data.

```js
import { isWebShareSupported } from './node_modules/@georapbox/web-share-element/dist/is-web-share-supported.js';

// Check if Web Share API is supported
if (isWebShareSupported()) {
  // Import component dynamically...
  const { WebShare } = await import('./node_modules/@georapbox/web-share-element/dist/web-share.js');

  WebShare.defineCustomElement();
}
```

## Changelog

For API updates and breaking changes, check the [CHANGELOG][changelog].

## Development setup

### Prerequisites

The project requires `Node.js` and `npm` to be installed on your environment. Preferrably, use [nvm](https://github.com/nvm-sh/nvm) Node Version Manager and use the version of Node.js specified in the `.nvmrc` file by running `nvm use`.

### Install dependencies

Install the project dependencies by running the following command.

```sh
npm install
```

### Build for development

Watch for changes and start a development server by running the following command.

```sh
npm start
```

### Linting

Lint the code by running the following command.

```sh
npm run lint
```

### Testing

Run the tests by running any of the following commands.

```sh
npm test
npm run test:watch # watch mode
```

### Build for production

Create a production build by running the following command.

```sh
npm run build
```

## License

[The MIT License (MIT)][license]
