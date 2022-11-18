const template = document.createElement('template');

const html = String.raw;

template.innerHTML = html`
  <slot name="button"><button type="button" part="button"><slot name="button-content">Share</slot></button></slot>
`;

class WebShare extends HTMLElement {
  #buttonSlot;
  #buttonEl;
  #files = null;

  constructor() {
    super();

    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    this.#buttonSlot = this.shadowRoot.querySelector('slot[name="button"]');
    this.#buttonEl = this.#getButton();
  }

  static get observedAttributes() {
    return ['disabled'];
  }

  connectedCallback() {
    this.#upgradeProperty('shareUrl');
    this.#upgradeProperty('shareTitle');
    this.#upgradeProperty('shareText');
    this.#upgradeProperty('shareFiles');
    this.#upgradeProperty('disabled');

    this.#buttonSlot && this.#buttonSlot.addEventListener('slotchange', this.#onSlotChange);
    this.#buttonEl && this.#buttonEl.addEventListener('click', this.#onClick);
  }

  disconnectedCallback() {
    this.#buttonSlot && this.#buttonSlot.removeEventListener('slotchange', this.#onSlotChange);
    this.#buttonEl && this.#buttonEl.removeEventListener('click', this.#onClick);
  }

  attributeChangedCallback(name) {
    if (name === 'disabled' && this.#buttonEl) {
      this.#buttonEl.disabled = this.disabled;
      this.#buttonEl.setAttribute('aria-disabled', this.disabled);

      if (this.#buttonEl.part && this.#buttonEl.part.contains('button')) {
        this.#buttonEl.part.toggle('button--disabled', this.disabled);
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
    return this.#files;
  }

  set shareFiles(value) {
    this.#files = value;
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
        composed: true,
        detail: { shareData }
      }));
    } catch (error) {
      if (error.name === 'AbortError') {
        return this.dispatchEvent(new Event('web-share:abort', {
          bubbles: true,
          composed: true
        }));
      }

      this.dispatchEvent(new CustomEvent('web-share:error', {
        bubbles: true,
        composed: true,
        detail: { error }
      }));
    }
  }

  #onClick = evt => {
    evt.preventDefault();

    if (this.disabled) {
      return;
    }

    this.dispatchEvent(new Event('web-share:click', {
      bubbles: true,
      composed: true
    }));

    this.share();
  };

  #onSlotChange = evt => {
    if (evt.target && evt.target.name === 'button') {
      this.#buttonEl && this.#buttonEl.removeEventListener('click', this.#onClick);
      this.#buttonEl = this.#getButton();

      if (this.#buttonEl) {
        this.#buttonEl.addEventListener('click', this.#onClick);

        if (this.#buttonEl.nodeName !== 'BUTTON' && !this.#buttonEl.hasAttribute('role')) {
          this.#buttonEl.setAttribute('role', 'button');
        }
      }
    }
  };

  #getButton() {
    if (!this.#buttonSlot) {
      return null;
    }

    return this.#buttonSlot.assignedElements({ flatten: true }).find(el => {
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
  #upgradeProperty(prop) {
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
