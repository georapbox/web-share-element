# CHANGELOG

## v2.1.3 (2022-06-29)

- Use `composed: true` for all dispatched events, to make them propagate across the shadow DOM boundary into the standard DOM.

## v2.1.2 (2022-06-07)

- Use `HTMLSlotElement.assignedElements()` method instead of `HTMLSlotElement.assignedNodes()` to get the elements assigned to slots.
- Minor updates to documentation.
- Update dev dependencies.

## v2.1.1 (2022-04-12)

- Check if Declarative Shadow DOM is present before imperatively attaching to host element.

## v2.1.0 (2022-04-07)

- Export the defined custom element as `web-share-defined.js` in case you don't want to manualy define it.
- Do not require `behavior="button"` attribute on the element with `slot="button"`.

## v2.0.0 (2022-04-03)

### Breaking changes

- Remove `hideIfUnsupported` property.
- Remove static method `WebShare.isSupported()`.
- Export utility function `isWebShareSupported()` to check for Web Share API support.
- Add `web-share:abort` when share is aborted. Previously, user needed to manually check if error's name was `AbortError` from the `web-share:error` event.

The reasoning behind removing the `hideIfUnsupported` property and `WebShare.isSupported()` static method was in order to give more flexibility to the user by providing a utility function that can check for [Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share) support. This way, the user can have the freedom to handle the API not being supported at will. For example user might want to dynamically import the component only if the Web Share API is supported.

## v1.1.0 (2022-03-23)

- Emit `web-share:click` event when the share button is clicked.
- Remove `all` CSS property from host element.

## v1.0.0 (2022-03-21)

- Initial release

