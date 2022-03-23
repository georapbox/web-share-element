import { elementUpdated, expect, fixture, fixtureCleanup, html, waitUntil } from '@open-wc/testing';
import sinon from 'sinon';
import { WebShare } from '../src/web-share.js';

WebShare.defineCustomElement();

describe('<web-share>', () => {
  it('passes accessibility test', async () => {
    const el = await fixture(html`<web-share></web-share>`);

    await expect(el).to.be.accessible();
  });

  it('default properties', async () => {
    const el = await fixture(html`<web-share></web-share>`);

    expect(el.shareUrl).to.be.null;
    expect(el.getAttribute('share-url')).to.be.null;

    expect(el.shareTitle).to.be.null;
    expect(el.getAttribute('share-title')).to.be.null;

    expect(el.shareText).to.be.null;
    expect(el.getAttribute('share-text')).to.be.null;

    expect(el.shareFiles).to.be.null;
    expect(el.getAttribute('share-files')).to.be.null;

    expect(el.disabled).to.be.false;
    expect(el.getAttribute('disabled')).to.be.null;

    expect(el.hideIfUnsupported).to.be.false;
    expect(el.getAttribute('hide-if-unsupported')).to.be.null;
  });

  it('change default properties', async () => {
    const el = await fixture(html`
      <web-share
        share-url="Share Url"
        share-title="Share title"
        share-text="Share text"
        disabled
        hide-if-unsupported
      ></web-share>
    `);

    expect(el.shareUrl).to.equal('Share Url');
    expect(el.getAttribute('share-url')).to.equal('Share Url');

    expect(el.shareTitle).to.equal('Share title');
    expect(el.getAttribute('share-title')).to.equal('Share title');

    expect(el.shareText).to.equal('Share text');
    expect(el.getAttribute('share-text')).to.equal('Share text');

    expect(el.disabled).to.be.true;
    expect(el.getAttribute('disabled')).to.equal('');

    expect(el.hideIfUnsupported).to.be.true;
    expect(el.getAttribute('hide-if-unsupported')).to.equal('');
  });

  it('change properties programmatically', async () => {
    const el = await fixture(html`<web-share></web-share>`);

    const file = new File(['foo'], 'foo.txt', { type: 'text/plain', });

    el.shareUrl = 'Share Url';
    el.shareTitle = 'Share title';
    el.shareText = 'Share text';
    el.shareFiles = [file];
    el.hideIfUnsupported = true;
    el.disabled = true;

    await elementUpdated(el);

    expect(el.shareUrl).to.equal('Share Url');
    expect(el.getAttribute('share-url')).to.equal('Share Url');

    expect(el.shareTitle).to.equal('Share title');
    expect(el.getAttribute('share-title')).to.equal('Share title');

    expect(el.shareText).to.equal('Share text');
    expect(el.getAttribute('share-text')).to.equal('Share text');

    expect((el.shareFiles)).to.be.an('array').that.is.not.empty;
    expect((el.shareFiles)).to.deep.include(file);

    expect(el.disabled).to.be.true;
    expect(el.getAttribute('disabled')).to.equal('');

    expect(el.hideIfUnsupported).to.be.true;
    expect(el.getAttribute('hide-if-unsupported')).to.equal('');
  });

  it('change button slot', async () => {
    const el = await fixture(html`
      <web-share>
        <button slot="button" behavior="button">Share this page</button>
      </web-share>
    `);

    expect(el).lightDom.to.equal('<button slot="button" behavior="button">Share this page</button>');
  });

  it('change button-content slot', async () => {
    const el = await fixture(html`
      <web-share>
        <span slot="button-content">Share this page</span>
      </web-share>
    `);

    expect(el).lightDom.to.equal('<span slot="button-content">Share this page</span>');
  });

  it('role="button" is added on button slot if node is not button', async () => {
    const el = await fixture(html`
      <web-share>
        <a href="#" slot="button" behavior="button">Share this page</a>
      </web-share>
    `);

    expect(el).lightDom.to.equal('<a href="#" slot="button" behavior="button" role="button">Share this page</a>');
  });

  it('web-share:click event is emitted', async () => {
    const el = await fixture(html`<web-share></web-share>`);
    const btn = el.shadowRoot.querySelector('button');
    const handler = sinon.spy();

    el.addEventListener('web-share:click', handler);

    btn.click();

    await waitUntil(() => handler.calledOnce);

    expect(handler).to.have.been.calledOnce;
  });

  it('share method is called', async () => {
    const el = await fixture(html`<web-share share-url="Share Url" share-title="Share title" share-text="Share text"></web-share>`);
    const btn = el.shadowRoot.querySelector('button');
    const fn = sinon.spy(el, 'share');

    el.shareFiles = [new File(['foo'], 'foo.txt', { type: 'text/plain', })];

    btn.click();

    expect(fn).to.have.been.calledOnce;
  });

  afterEach(() => {
    fixtureCleanup();
  });
});
