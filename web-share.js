const template = document.createElement('template');

template.innerHTML = /*template*/`
  <style>
    :host {
      all: initial;
    }
  </style>

  <slot name="button"><button type="button" part="button" behavior="button"><slot name="button-content">Share</slot></button></slot>
`;

export class WebShare extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(template.content.cloneNode(true));

    this._files = null;

    this._buttonSlot = this.shadowRoot.querySelector('slot[name="button"]');
    this.$button = this._buttonSlot.assignedNodes({ flatten: true }).find(el => el.getAttribute('behavior') === 'button');

    if (this.$button) {
      this.$button.hidden = this.hideIfUnsupported && !navigator.share;
    }

    this.share = this.share.bind(this);
    this._onSlotChange = this._onSlotChange.bind(this);
  }

  static get observedAttributes() {
    return ['hide-if-unsupported', 'disabled'];
  }

  connectedCallback() {
    this._buttonSlot.addEventListener('slotchange', this._onSlotChange);
    this.$button && this.$button.addEventListener('click', this.share);
  }

  disconnectedCallback() {
    this.$button && this.$button.removeEventListener('click', this.share);
  }

  attributeChangedCallback(name) {
    if (name === 'hide-if-unsupported' && this.$button) {
      this.$button.hidden = this.hideIfUnsupported && !navigator.share;
    }

    if (name === 'disabled' && this.$button) {
      this.$button.disabled = this.disabled;
      this.$button.part = this.disabled ? 'button disabled' : 'button';
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

  get url() {
    return this.getAttribute('url') || '';
  }

  set url(value) {
    this.setAttribute('url', value);
  }

  get title() {
    return this.getAttribute('title') || '';
  }

  set title(value) {
    this.setAttribute('title', value);
  }

  get text() {
    return this.getAttribute('text') || '';
  }

  set text(value) {
    this.setAttribute('text', value);
  }

  get files() {
    return this._files;
  }

  set files(value) {
    this._files = value;
  }

  async share() {
    if (this.disabled) {
      return;
    }

    try {
      const shareData = {
        url: this.url,
        title: this.title,
        text: this.text
      };

      if (Array.isArray(this.files) && navigator.canShare && navigator.canShare({ files: this.files })) {
        shareData.files = this.files;
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

  _onSlotChange() {
    this.$button && this.$button.removeEventListener('click', this.share);
    this.$button = this._buttonSlot.assignedNodes({ flatten: true }).find(el => el.getAttribute('behavior') === 'button');
    this.$button && this.$button.addEventListener('click', this.share);
  }

  static defineCustomElement(elementName = 'web-share') {
    if (typeof window !== 'undefined' && !window.customElements.get(elementName)) {
      window.customElements.define(elementName, WebShare);
    }
  }
}
