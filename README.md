[demo]: https://georapbox.github.io/web-share-element/
[support]: https://caniuse.com/#feat=custom-elementsv1
[exceptions]: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share#exceptions
[polyfill]: https://github.com/webcomponents/polyfills/tree/master/packages/custom-elements
[license]: https://georapbox.mit-license.org/@2022

# &lt;web-share&gt; element

A custom element to share links, text, and files to other apps.

[API documentation](#api) &bull; [Demo][demo]

## Usage

### Script

```js
import { WebShare } from '<YOUR_PATH>/web-share.js';

// By default, the element is not automatically defined to offer more flexibility.
WebShare.defineCustomElement();
```

### Markup

```html
<web-share url="https://developer.mozilla.org" title="MDN" text="Learn web development on MDN!">
  <button slot="button" behavior="button">Share this page</button>
</web-share>
```

### Style

By default, the component is style-free to remain as less opinionated as possible. However, you can style the various elements of the component using the `::part()` CSS pseudo-elements provided for this purpose. Below are demonstrated all available parts for styling.

```css
web-share:not(:defined) {
  /* Host element - not defined state */
}

web-share {
  /* Host element */
}

web-share::part(button) {
  /* The button element */
}

web-share::part(button disabled) {
  /* the button element - disabled state */
}
```

## API

### Properties/Attributes
| Property name | Attribute name | Type | Default | Description |
| ------------- | -------------- | ---- | ------- | ----------- |
| `url` | `url` | String | `''` | Optional. A string representing a URL to be shared. |
| `title` | `title` | String | `''` | Optional. A string representing a title to be shared. |
| `text` | `text` | String | `''` | Optional. A string representing text to be shared. |
| `disabled` | `disabled` | Boolean | `false` | Optional. Defines if the share button is disabled. |
| `hideIfUnsupported` | `hide-if-unsupported` | Boolean | `false` | Optional. Defines if the share button is hidden if Web Share API is not supported by the platfrom. |

All properties reflect their values as HTML attributes to keep the element's DOM representation in sync with its JavaScript state.

### Slots

Below is a list with all available slots provided by the component so that you can fill with your own markup and override some of the default elements.

| Slot name | Description |
| ------------------- | ----------- |
| `button` | Override the share button with another element of your preference. It is omportant to note that you will need to provide the `behavior="button"` attribute to your element, to tell the browser that this is the element you want to use as the new share button. Example: `<button slot="button" behavior="button">Share this page</button>` |
| `button-content` | Override the share button's content with content of your preference. Useful if all you need is to change the button's label. Example: `<span slot="button-content">Share this page</span>` |

### Static methods

#### WebShare.defineCustomElement(elementName='web-share')

Defines/registers the custom element with the name provided. If no name is provided, the default name is used. The method checks if the element is already defined, hence will skip trying to redefine it.

| Param | Type | Default | Description |
| ----- | ---- | ------- | ----------- |
| elementName | `string` | `web-share` | Name for the new custom element |

### Events

**web-share:success** - This event is triggered on if share is successful.

```js
document.addEventListener('web-share:success', () => {
  console.log('Share was successful');
});
```

**web-share:error** - This event is triggered on if an error occurs. Here is a [full list of possible exceptions][exceptions].

```js
document.addEventListener('web-share:error', evt => {
  console.log(evt.detail); // => { error: DOMException: Share canceled }
});
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
      background-color: var(--button-bg-color);
      color: var(--button-text-color);
      border: 0;
      padding: 0.375rem 0.75rem;
      border-radius: 0.25rem;
      font-size: 1rem;
      cursor: pointer;
      -webkit-appearance: none;
      -moz-appearance: none;
    }

    web-share::part(button disabled) {
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
    import { WebShare } from './web-share.js';

    WebShare.defineCustomElement();

    const webShareElement = document.querySelector('web-share');

    webShareElement.url = window.location.href;
    webShareElement.title = document.title;
    webShareElement.text = document.querySelector('meta[name="description"]').content;
  </script>
</body>
</html>
```

## Browser support

Browsers without native [custom element support][support] require a [polyfill][polyfill].

- Firefox
- Chrome
- Microsoft Edge
- Safari

## License

[The MIT License (MIT)][license]
