// @ts-check

/**
 * Represents a value that may be of type T, or null.
 *
 * @template T
 * @typedef {T | null} Nullable
 */

/**
 * Represents the data to share.
 *
 * @typedef {Object} ShareData
 * @property {string} [url] - The URL to share.
 * @property {string} [title] - The title to share.
 * @property {string} [text] - The text to share.
 * @property {File[]} [files] - The files to share.
 */

const styles = /* css */ `
  :host {
    display: inline-block;
  }
`;

const template = document.createElement('template');

template.innerHTML = /* html */ `
  <style>${styles}</style>
  <slot name="button"><button type="button" part="button"><slot name="button-content">Share</slot></button></slot>
`;

/**
 * @summary A custom element that provides a button to share content.
 * @documentation https://github.com/georapbox/web-share-element#readme
 *
 * @tagname web-share - This is the default tag name, unless overridden by the `defineCustomElement` method.
 *
 * @property {boolean} disabled - Indicates whether the button is disabled.
 * @property {string} shareUrl - The URL to share.
 * @property {string} shareTitle - The title to share.
 * @property {string} shareText - The text to share.
 * @property {File[]} shareFiles - The files to share.
 *
 * @attribute {boolean} disabled - Reflects the disabled property.
 * @attribute {string} share-url - Reflects the shareUrl property.
 * @attribute {string} share-title - Reflects the shareTitle property.
 * @attribute {string} share-text - Reflects the shareText property.
 *
 * @slot button - The button to share content.
 * @slot button-content - The content of the button to share content.
 *
 * @csspart button - The button to share content.
 * @csspart button--disabled - The button to share content when disabled.
 *
 * @event web-share:success - Fired when the share operation is successful.
 * @event web-share:abort - Fired when the share operation is aborted.
 * @event web-share:error - Fired when the share operation fails.
 *
 * @method defineCustomElement - Static method. Defines the custom element with the given name.
 * @method share - Instance method. Shares the shareable data taken from the element's properties.
 */
class WebShare extends HTMLElement {
  /** @type {Nullable<HTMLSlotElement>} */
  #buttonSlot;

  /** @type {Nullable<Element>} */
  #buttonEl;

  /** @type {File[]} */
  #files = [];

  constructor() {
    super();

    if (!this.shadowRoot) {
      const shadowRoot = this.attachShadow({ mode: 'open', delegatesFocus: true });
      shadowRoot.appendChild(template.content.cloneNode(true));
    }

    this.#buttonSlot = this.shadowRoot?.querySelector('slot[name="button"]') || null;
    this.#buttonEl = this.#getButton();
  }

  static get observedAttributes() {
    return ['disabled'];
  }

  /**
   * Lifecycle method that is called when attributes are changed, added, removed, or replaced.
   *
   * @param {string} name - The name of the attribute.
   * @param {string} oldValue - The old value of the attribute.
   * @param {string} newValue - The new value of the attribute.
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'disabled' && oldValue !== newValue && this.#buttonEl) {
      this.#buttonEl.toggleAttribute('disabled', this.disabled);
      this.#buttonEl.setAttribute('aria-disabled', this.disabled.toString());

      if (this.#buttonEl.part && this.#buttonEl.part.contains('button')) {
        this.#buttonEl.part.toggle('button--disabled', this.disabled);
      }
    }
  }

  /**
   * Lifecycle method that is called when the element is added to the DOM.
   */
  connectedCallback() {
    this.#upgradeProperty('shareUrl');
    this.#upgradeProperty('shareTitle');
    this.#upgradeProperty('shareText');
    this.#upgradeProperty('shareFiles');
    this.#upgradeProperty('disabled');

    this.#buttonSlot?.addEventListener('slotchange', this.#handleSlotChange);
    this.#buttonEl?.addEventListener('click', this.#handleClick);
  }

  /**
   * Lifecycle method that is called when the element is removed from the DOM.
   */
  disconnectedCallback() {
    this.#buttonSlot?.removeEventListener('slotchange', this.#handleSlotChange);
    this.#buttonEl?.removeEventListener('click', this.#handleClick);
  }

  /**
   * @type {boolean} - Indicates whether the button is disabled.
   * @default false
   * @attribute disabled - Reflects the disabled property.
   */
  get disabled() {
    return this.hasAttribute('disabled');
  }

  set disabled(value) {
    this.toggleAttribute('disabled', !!value);
  }

  /**
   * @type {string} - The URL to share.
   * @attribute share-url - Reflects the shareUrl property.
   */
  get shareUrl() {
    return this.getAttribute('share-url') || '';
  }

  set shareUrl(value) {
    this.setAttribute('share-url', value);
  }

  /**
   * @type {string} - The title to share.
   * @attribute share-title - Reflects the shareTitle property.
   */
  get shareTitle() {
    return this.getAttribute('share-title') || '';
  }

  set shareTitle(value) {
    this.setAttribute('share-title', value);
  }

  /**
   * @type {string} - The text to share.
   * @attribute share-text - Reflects the shareText property.
   */
  get shareText() {
    return this.getAttribute('share-text') || '';
  }

  set shareText(value) {
    this.setAttribute('share-text', value);
  }

  /**
   * @type {File[]} - The files to share.
   */
  get shareFiles() {
    return this.#files;
  }

  set shareFiles(value) {
    if (Array.isArray(value) && value.length > 0) {
      this.#files = value;
    }
  }

  /**
   * Shares the shareable data taken from the element's properties.
   *
   * @returns {Promise<void>} - A promise that resolves when the share operation is complete.
   */
  async share() {
    if (this.disabled) {
      return;
    }

    try {
      /** @type {ShareData} */
      const shareData = {};

      if (this.shareUrl) {
        shareData.url = this.shareUrl;
      }

      if (this.shareTitle) {
        shareData.title = this.shareTitle;
      }

      if (this.shareText) {
        shareData.text = this.shareText;
      }

      if (
        Array.isArray(this.shareFiles) &&
        this.shareFiles.length > 0 &&
        navigator.canShare &&
        navigator.canShare({ files: this.shareFiles })
      ) {
        shareData.files = this.shareFiles;
      }

      await navigator.share(shareData);

      this.dispatchEvent(
        new CustomEvent('web-share:success', {
          bubbles: true,
          composed: true,
          detail: { shareData }
        })
      );
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        this.dispatchEvent(
          new CustomEvent('web-share:abort', {
            bubbles: true,
            composed: true,
            detail: { error }
          })
        );

        return;
      }

      this.dispatchEvent(
        new CustomEvent('web-share:error', {
          bubbles: true,
          composed: true,
          detail: { error }
        })
      );
    }
  }

  /**
   * Handles the click event on the button.
   *
   * @param {any} evt - The event object.
   */
  #handleClick = evt => {
    evt.preventDefault();

    if (this.disabled) {
      return;
    }

    this.share();
  };

  /**
   * Handles the slotchange event on the button slot.
   *
   * @param {any} evt - The event object.
   */
  #handleSlotChange = evt => {
    if (evt.target && evt.target.name === 'button') {
      this.#buttonEl?.removeEventListener('click', this.#handleClick);
      this.#buttonEl = this.#getButton();

      if (this.#buttonEl) {
        this.#buttonEl.addEventListener('click', this.#handleClick);

        if (this.#buttonEl.nodeName !== 'BUTTON' && !this.#buttonEl.hasAttribute('role')) {
          this.#buttonEl.setAttribute('role', 'button');
        }
      }
    }
  };

  /**
   * Returns the button element from the button slot.
   *
   * @returns {Nullable<Element>} - The button element.
   */
  #getButton() {
    if (!this.#buttonSlot) {
      return null;
    }

    return (
      this.#buttonSlot.assignedElements({ flatten: true }).find(el => {
        return el.nodeName === 'BUTTON' || el.getAttribute('slot') === 'button';
      }) || null
    );
  }

  /**
   * This is to safe guard against cases where, for instance, a framework may have added the element to the page and set a
   * value on one of its properties, but lazy loaded its definition. Without this guard, the upgraded element would miss that
   * property and the instance property would prevent the class property setter from ever being called.
   *
   * https://developers.google.com/web/fundamentals/web-components/best-practices#lazy-properties
   *
   * @param {'shareUrl' | 'shareTitle' | 'shareText' | 'shareFiles' | 'disabled'} prop - The property name to upgrade.
   */
  #upgradeProperty(prop) {
    /** @type {any} */
    const instance = this;

    if (Object.prototype.hasOwnProperty.call(instance, prop)) {
      const value = instance[prop];
      delete instance[prop];
      instance[prop] = value;
    }
  }

  /**
   * Defines a custom element with the given name.
   * The name must contain a dash (-).
   *
   * @param {string} [elementName='web-share'] - The name of the custom element.
   * @example
   *
   * ClipboardCopy.defineCustomElement('my-web-share');
   */
  static defineCustomElement(elementName = 'web-share') {
    if (typeof window !== 'undefined' && !window.customElements.get(elementName)) {
      window.customElements.define(elementName, WebShare);
    }
  }
}

export { WebShare };
