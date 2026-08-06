/*
 * Compatibility helper for the original exported pages.
 * The visual design intentionally keeps image-slot placeholders when no
 * school photography has been supplied yet.
 */
(function () {
  if (customElements.get("image-slot")) return;
  class ImageSlot extends HTMLElement {
    connectedCallback() {
      if (this.dataset.ready) return;
      this.dataset.ready = "true";
      const src = this.getAttribute("src");
      const label = this.getAttribute("placeholder") || "Foto sekolah";
      this.style.display = "block";
      this.style.width = this.style.width || "100%";
      this.style.height = this.style.height || "100%";
      this.style.minHeight = this.style.minHeight || "120px";
      this.style.background = "linear-gradient(135deg,#0B5ED7 0%,#2F80ED 52%,#7C3AED 100%)";
      this.style.position = "relative";
      this.setAttribute("role", "img");
      this.setAttribute("aria-label", label);
      if (src) {
        const image = new Image();
        image.alt = label;
        image.src = src;
        image.style.cssText = "width:100%;height:100%;object-fit:cover;display:block";
        image.onload = () => {
          this.replaceChildren(image);
          this.style.background = "#dbeafe";
        };
      }
    }
  }
  customElements.define("image-slot", ImageSlot);
})();