# CHANGELOG

## v2.1.0 (2022-07-04)

- Do not require `behavior="button"` attribute on the element with `slot="button"`.

## v2.0.0 (2022-03-04)

### Breaking changes

- Remove `hideIfUnsupported` property.
- Remove static method `WebShare.isSupported()`.
- Export utility function `isWebShareSupported()` to check for Web Share API support.
- Add `web-share:abort` when share is aborted. Previously, user needed to manually check if error's name was `AbortError` from the `web-share:error` event.

The reasoning behind removing the `hideIfUnsupported` property and `WebShare.isSupported()` static method was in order to give more flexibility to the user by providing a utility function that can check for [Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share) support. This way, the user can have the freedom to handle the API not being supported at will. For example user might want to dynamically import the component only if the Web Share API is supported.

## v1.1.0 (2022-23-03)

- Emit `web-share:click` event when the share button is clicked.
- Remove `all` CSS property from host element.

## v1.0.0 (2022-21-03)

- Initial release

