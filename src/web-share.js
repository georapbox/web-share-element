const template = document.createElement('template');

template.innerHTML = /*template*/`
  <style>
    :host {
      all: initial;
      box-sizing: border-box;
    }

    :host *,
    :host *::before,
    :host *::after {
      box-sizing: inherit;
    }

    [hidden] {
      display: none !important;
    }
  </style>

  <slot name="button"><button type="button" part="button" behavior="button"><slot name="button-content">Share</slot></button></slot>
`;

/**
 * @slot button - The share button.
 * @slot button-content - The share button's content.
 *
 * @csspart button - The share button.
 * @csspart button--disabled - The share button when is disabled.
 *
 * @event web-share:success - Emitted when share is successful.
 * @event web-share:error - Emitted when share fails for any reason.
 *
 * @example
 *
 * <web-share share-url="https://developer.mozilla.org" share-title="MDN" share-text="Learn web development on MDN!">
 *   <button slot="button" behavior="button">Share this page</button>
 * </web-share>
 */
class WebShare extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this._buttonSlot = this.shadowRoot.querySelector('slot[name="button"]');
    this.$button = this._buttonSlot.assignedNodes({ flatten: true }).find(el => el.getAttribute('behavior') === 'button');

    if (this.$button) {
      this.$button.hidden = this.hideIfUnsupported && !WebShare.isSupported();
    }

    this._onShareButtonClick = this._onShareButtonClick.bind(this);
    this._onSlotChange = this._onSlotChange.bind(this);
  }

  static get observedAttributes() {
    return ['hide-if-unsupported', 'disabled'];
  }

  connectedCallback() {


    this._buttonSlot.addEventListener('slotchange', this._onSlotChange);

    if (this.$button) {
      this.$button.addEventListener('click', this._onShareButtonClick);

      if (this.$button.nodeName !== 'BUTTON') {
        this.$button.setAttribute('role', 'button');
      }
    }

    this._upgradeProperty('shareUrl');
    this._upgradeProperty('shareTitle');
    this._upgradeProperty('shareText');
    this._upgradeProperty('shareFiles');
    this._upgradeProperty('disabled');
    this._upgradeProperty('hideIfUnsupported');
  }

  disconnectedCallback() {
    this.$button && this.$button.removeEventListener('click', this._onShareButtonClick);
  }

  attributeChangedCallback(name) {
    if (name === 'hide-if-unsupported' && this.$button) {
      this.$button.hidden = this.hideIfUnsupported && !WebShare.isSupported();
    }

    if (name === 'disabled' && this.$button) {
      this.$button.disabled = this.disabled;
      this.$button.setAttribute('aria-disabled', this.disabled);

      if (this.$button.part && this.$button.part.contains('button')) {
        this.$button.part.toggle('button--disabled', this.disabled);
      }
    }
  }

  get hideIfUnsupported() {
    return this.hasAttribute('hide-if-unsupported');
  }

  set hideIfUnsupported(value) {
    if (value) {
      this.setAttribute('hide-if-unsupported', '');
    } else {
      this.removeAttribute('hide-if-unsupported');
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
      this.dispatchEvent(new CustomEvent('web-share:error', {
        bubbles: true,
        detail: { error }
      }));
    }
  }

  _onShareButtonClick(evt) {
    evt.preventDefault();
    this.share();
  }

  _onSlotChange(evt) {
    if (evt.target && evt.target.name === 'button') {
      this.$button && this.$button.removeEventListener('click', this._onShareButtonClick);
      this.$button = this._buttonSlot.assignedNodes({ flatten: true }).find(el => el.getAttribute('behavior') === 'button');

      if (this.$button) {
        this.$button.addEventListener('click', this._onShareButtonClick);

        if (this.$button.nodeName !== 'BUTTON') {
          this.$button.setAttribute('role', 'button');
        }
      }
    }
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

  static isSupported() {
    return Boolean(navigator.share);
  }

  static defineCustomElement(elementName = 'web-share') {
    if (typeof window !== 'undefined' && !window.customElements.get(elementName)) {
      window.customElements.define(elementName, WebShare);
    }
  }
}

export { WebShare };
