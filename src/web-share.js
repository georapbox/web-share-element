const template = document.createElement('template');

const html = String.raw;

template.innerHTML = html`
  <slot name="button"><button type="button" part="button"><slot name="button-content">Share</slot></button></slot>
`;

/**
 * @slot button - The share button.
 * @slot button-content - The share button's content.
 *
 * @csspart button - The share button.
 * @csspart button--disabled - The share button when is disabled.
 *
 * @event web-share:click - Emitted when share button is clicked.
 * @event web-share:success - Emitted when share is successful.
 * @event web-share:error - Emitted when share fails for any reason.
 * @event web-share:abort - Emitted when share is aborted.
 *
 * @example
 *
 * <web-share share-url="https://developer.mozilla.org" share-title="MDN" share-text="Learn web development on MDN!">
 *   <button slot="button" type="button">Share this page</button>
 * </web-share>
 */
class WebShare extends HTMLElement {
  constructor() {
    super();

    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    this._buttonSlot = this.shadowRoot.querySelector('slot[name="button"]');
    this.$button = this._getButton();

    this._onClick = this._onClick.bind(this);
    this._onSlotChange = this._onSlotChange.bind(this);
  }

  static get observedAttributes() {
    return ['disabled'];
  }

  connectedCallback() {
    this._buttonSlot && this._buttonSlot.addEventListener('slotchange', this._onSlotChange);
    this.$button && this.$button.addEventListener('click', this._onClick);

    this._upgradeProperty('shareUrl');
    this._upgradeProperty('shareTitle');
    this._upgradeProperty('shareText');
    this._upgradeProperty('shareFiles');
    this._upgradeProperty('disabled');
  }

  disconnectedCallback() {
    this._buttonSlot && this._buttonSlot.removeEventListener('slotchange', this._onSlotChange);
    this.$button && this.$button.removeEventListener('click', this._onClick);
  }

  attributeChangedCallback(name) {
    if (name === 'disabled' && this.$button) {
      this.$button.disabled = this.disabled;
      this.$button.setAttribute('aria-disabled', this.disabled);

      if (this.$button.part && this.$button.part.contains('button')) {
        this.$button.part.toggle('button--disabled', this.disabled);
      }
    }
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }

  set disabled(value) {
    if (value) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
    }
  }

  get shareUrl() {
    return this.getAttribute('share-url');
  }

  set shareUrl(value) {
    this.setAttribute('share-url', value);
  }

  get shareTitle() {
    return this.getAttribute('share-title');
  }

  set shareTitle(value) {
    this.setAttribute('share-title', value);
  }

  get shareText() {
    return this.getAttribute('share-text');
  }

  set shareText(value) {
    this.setAttribute('share-text', value);
  }

  get shareFiles() {
    return this._files || null;
  }

  set shareFiles(value) {
    this._files = value;
  }

  async share() {
    if (this.disabled) {
      return;
    }

    try {
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
        Array.isArray(this.shareFiles)
        && this.shareFiles.length > 0
        && navigator.canShare
        && navigator.canShare({ files: this.shareFiles })
      ) {
        shareData.files = this.shareFiles;
      }

      await navigator.share(shareData);

      this.dispatchEvent(new CustomEvent('web-share:success', {
        bubbles: true,
        detail: { shareData }
      }));
    } catch (error) {
      if (error.name === 'AbortError') {
        return this.dispatchEvent(new Event('web-share:abort', {
          bubbles: true
        }));
      }

      this.dispatchEvent(new CustomEvent('web-share:error', {
        bubbles: true,
        detail: { error }
      }));
    }
  }

  _onClick(evt) {
    evt.preventDefault();

    if (this.disabled) {
      return;
    }

    this.dispatchEvent(new Event('web-share:click', {
      bubbles: true
    }));

    this.share();
  }

  _onSlotChange(evt) {
    if (evt.target && evt.target.name === 'button') {
      this.$button && this.$button.removeEventListener('click', this._onClick);
      this.$button = this._getButton();

      if (this.$button) {
        this.$button.addEventListener('click', this._onClick);

        if (this.$button.nodeName !== 'BUTTON' && !this.$button.hasAttribute('role')) {
          this.$button.setAttribute('role', 'button');
        }
      }
    }
  }

  _getButton() {
    if (!this._buttonSlot) {
      return null;
    }

    return this._buttonSlot.assignedElements({ flatten: true }).find(el => {
      return el.nodeName === 'BUTTON' || el.getAttribute('slot') === 'button';
    });
  }

  /**
   * https://developers.google.com/web/fundamentals/web-components/best-practices#lazy-properties
   * This is to safe guard against cases where, for instance, a framework
   * may have added the element to the page and set a value on one of its
   * properties, but lazy loaded its definition. Without this guard, the
   * upgraded element would miss that property and the instance property
   * would prevent the class property setter from ever being called.
   */
  _upgradeProperty(prop) {
    if (Object.prototype.hasOwnProperty.call(this, prop)) {
      const value = this[prop];
      delete this[prop];
      this[prop] = value;
    }
  }

  static defineCustomElement(elementName = 'web-share') {
    if (typeof window !== 'undefined' && !window.customElements.get(elementName)) {
      window.customElements.define(elementName, WebShare);
    }
  }
}

export { WebShare };
