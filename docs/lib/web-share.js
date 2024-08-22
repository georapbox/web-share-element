/*!
 * @georapbox/web-share-element
 * A custom element that implements the Web Share API to share user-defined data.
 *
 * @version 3.1.1
 * @homepage https://github.com/georapbox/web-share-element#readme
 * @author George Raptis <georapbox@gmail.com>
 * @license MIT
 */
var h=`
  :host {
    display: inline-block;
  }
`,r=document.createElement("template");r.innerHTML=`
  <style>${h}</style>
  <slot name="button"><button type="button" part="button"><slot name="button-content">Share</slot></button></slot>
`;var i=class a extends HTMLElement{#e;#t;#r=[];constructor(){super(),this.shadowRoot||this.attachShadow({mode:"open",delegatesFocus:!0}).appendChild(r.content.cloneNode(!0)),this.#e=this.shadowRoot?.querySelector('slot[name="button"]')||null,this.#t=this.#h()}static get observedAttributes(){return["disabled"]}attributeChangedCallback(t,e,s){t==="disabled"&&e!==s&&this.#t&&(this.#t.toggleAttribute("disabled",this.disabled),this.#t.setAttribute("aria-disabled",this.disabled.toString()),this.#t.part&&this.#t.part.contains("button")&&this.#t.part.toggle("button--disabled",this.disabled))}connectedCallback(){this.#s("shareUrl"),this.#s("shareTitle"),this.#s("shareText"),this.#s("shareFiles"),this.#s("disabled"),this.#e?.addEventListener("slotchange",this.#a),this.#t?.addEventListener("click",this.#i)}disconnectedCallback(){this.#e?.removeEventListener("slotchange",this.#a),this.#t?.removeEventListener("click",this.#i)}get disabled(){return this.hasAttribute("disabled")}set disabled(t){this.toggleAttribute("disabled",!!t)}get shareUrl(){return this.getAttribute("share-url")||""}set shareUrl(t){this.setAttribute("share-url",t)}get shareTitle(){return this.getAttribute("share-title")||""}set shareTitle(t){this.setAttribute("share-title",t)}get shareText(){return this.getAttribute("share-text")||""}set shareText(t){this.setAttribute("share-text",t)}get shareFiles(){return this.#r}set shareFiles(t){Array.isArray(t)&&t.length>0&&(this.#r=t)}async share(){if(!this.disabled)try{let t={};this.shareUrl&&(t.url=this.shareUrl),this.shareTitle&&(t.title=this.shareTitle),this.shareText&&(t.text=this.shareText),Array.isArray(this.shareFiles)&&this.shareFiles.length>0&&navigator.canShare&&navigator.canShare({files:this.shareFiles})&&(t.files=this.shareFiles),await navigator.share(t),this.dispatchEvent(new CustomEvent("web-share:success",{bubbles:!0,composed:!0,detail:{shareData:t}}))}catch(t){if(t instanceof Error&&t.name==="AbortError"){this.dispatchEvent(new CustomEvent("web-share:abort",{bubbles:!0,composed:!0,detail:{error:t}}));return}this.dispatchEvent(new CustomEvent("web-share:error",{bubbles:!0,composed:!0,detail:{error:t}}))}}#i=t=>{t.preventDefault(),!this.disabled&&this.share()};#a=t=>{t.target&&t.target.name==="button"&&(this.#t?.removeEventListener("click",this.#i),this.#t=this.#h(),this.#t&&(this.#t.addEventListener("click",this.#i),this.#t.nodeName!=="BUTTON"&&!this.#t.hasAttribute("role")&&this.#t.setAttribute("role","button")))};#h(){return this.#e&&this.#e.assignedElements({flatten:!0}).find(t=>t.nodeName==="BUTTON"||t.getAttribute("slot")==="button")||null}#s(t){let e=this;if(Object.prototype.hasOwnProperty.call(e,t)){let s=e[t];delete e[t],e[t]=s}}static defineCustomElement(t="web-share"){typeof window<"u"&&!window.customElements.get(t)&&window.customElements.define(t,a)}};export{i as WebShare};
