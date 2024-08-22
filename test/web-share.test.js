import { elementUpdated, expect, fixture, fixtureCleanup, html } from '@open-wc/testing';
import sinon from 'sinon';
import { WebShare } from '../src/web-share.js';

WebShare.defineCustomElement();

describe('<web-share>', () => {
  afterEach(() => {
    fixtureCleanup();
  });

  describe('accessibility', () => {
    it('passes accessibility test', async () => {
      const el = await fixture(html`<web-share></web-share>`);
      await expect(el).to.be.accessible();
    });

    it('role="button" is added on button slot if node is not button', async () => {
      const el = await fixture(html`
        <web-share>
          <a href="#" slot="button">Share this page</a>
        </web-share>
      `);

      expect(el).lightDom.to.equal('<a href="#" slot="button" role="button">Share this page</a>');
    });

    it('aria-disabled="true" is added on button if disabled', async () => {
      const el = await fixture(html`<web-share disabled></web-share>`);
      const btn = el.shadowRoot.querySelector('button');
      expect(btn).to.have.attribute('aria-disabled', 'true');
    });
  });

  describe('attributes - properties', () => {
    // share-url
    it('reflects attribute "share-url" to property "shareUrl"', async () => {
      const el = await fixture(html`<web-share share-url="Share Url"></web-share>`);
      expect(el.shareUrl).to.equal('Share Url');
    });

    it('reflects property "shareUrl" to attribute "share-url"', async () => {
      const el = await fixture(html`<web-share></web-share>`);
      el.shareUrl = 'Share Url';
      await elementUpdated(el);
      expect(el.getAttribute('share-url')).to.equal('Share Url');
    });

    // share-title
    it('reflects attribute "share-title" to property "shareTitle"', async () => {
      const el = await fixture(html`<web-share share-title="Share title"></web-share>`);
      expect(el.shareTitle).to.equal('Share title');
    });

    it('reflects property "shareTitle" to attribute "share-title"', async () => {
      const el = await fixture(html`<web-share></web-share>`);
      el.shareTitle = 'Share title';
      await elementUpdated(el);
      expect(el.getAttribute('share-title')).to.equal('Share title');
    });

    // share-text
    it('reflects attribute "share-text" to property "shareText"', async () => {
      const el = await fixture(html`<web-share share-text="Share text"></web-share>`);
      expect(el.shareText).to.equal('Share text');
    });

    it('reflects property "shareText" to attribute "share-text"', async () => {
      const el = await fixture(html`<web-share></web-share>`);
      el.shareText = 'Share text';
      await elementUpdated(el);
      expect(el.getAttribute('share-text')).to.equal('Share text');
    });

    // disabled
    it('reflects attribute "disabled" to property "disabled"', async () => {
      const el = await fixture(html`<web-share disabled></web-share>`);
      expect(el.disabled).to.be.true;
    });

    it('reflects property "disabled" to attribute "disabled"', async () => {
      const el = await fixture(html`<web-share></web-share>`);
      el.disabled = true;
      await elementUpdated(el);
      expect(el.getAttribute('disabled')).to.equal('');
    });
  });

  describe('slots', () => {
    it('change button slot', async () => {
      const el = await fixture(html`
        <web-share>
          <button slot="button" type="button">Share this page</button>
        </web-share>
      `);

      expect(el).lightDom.to.equal('<button slot="button" type="button">Share this page</button>');
    });

    it('change button slot with non button element', async () => {
      const el = await fixture(html`
        <web-share>
          <a href="#" slot="button" role="button">Share this page</a>
        </web-share>
      `);

      expect(el).lightDom.to.equal('<a href="#" slot="button" role="button">Share this page</a>');
    });

    it('change button-content slot', async () => {
      const el = await fixture(html`
        <web-share>
          <span slot="button-content">Share this page</span>
        </web-share>
      `);

      expect(el).lightDom.to.equal('<span slot="button-content">Share this page</span>');
    });
  });

  describe('CSS Parts', () => {
    it('should have "button" CSS Part', async () => {
      const el = await fixture(html`<web-share></web-share>`);
      const btn = el.shadowRoot.querySelector('[part="button"]');
      expect(btn).to.exist;
    });

    it('should have "button--disabled" CSS Part', async () => {
      const el = await fixture(html`<web-share disabled></web-share>`);
      const btn = el.shadowRoot.querySelector('[part*="button--disabled"]');
      expect(btn).to.exist;
    });
  });

  describe('methods', () => {
    it('share method is called', async () => {
      const el = await fixture(
        html`<web-share share-url="Share Url" share-title="Share title" share-text="Share text"></web-share>`
      );
      const btn = el.shadowRoot.querySelector('button');
      const fn = sinon.spy(el, 'share');
      el.shareFiles = [new File(['foo'], 'foo.txt', { type: 'text/plain' })];
      btn.click();
      expect(fn).to.have.been.calledOnce;
    });
  });
});
