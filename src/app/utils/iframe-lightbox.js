import { crumbs } from "./crumbs";

export class iFrameLightbox {
  constructor() {
    console.log("iFrameLightbox constructor");
    const scriptTag = document.querySelector(
      "script[src*='engrid-iframe-lightbox']"
    );
    this.url = scriptTag.getAttribute("data-engrid-url") || "";
    this.overlayBgColor =
      scriptTag.getAttribute("data-engrid-overlay-bgcolor") || "#000000";
    this.contentBgColor =
      scriptTag.getAttribute("data-engrid-content-bgcolor") || "#FFFFFF";
    this.maxWidth = scriptTag.getAttribute("data-engrid-max-width") || "800px";
    if (this.url && this.shouldRun()) {
      this.init();
      return;
    }
    console.log("iFrameLightbox Should Not Run");
  }
  init() {
    console.log("iFrameLightbox init");
    this.createLightbox();
    window.setTimeout(this.open.bind(this), 500);

    window.onmessage = (e) => {
      const iframe_id = "engrid-iframe";

      if (e.data.hasOwnProperty("frameHeight")) {
        document.getElementById(
          iframe_id
        ).style.height = `${e.data.frameHeight}px`;
      }
    };
  }
  shouldRun() {
    let hideLightbox = !!parseInt(crumbs.get("engridLightbox")); // Get cookie
    return !hideLightbox;
  }
  createLightbox() {
    console.log("iFrameLightbox createLightbox");
    let overlay = document.createElement("div");
    if (document.getElementById("engrid-overlay")) {
      document.getElementById("engrid-overlay").remove();
    }
    overlay.id = "engrid-overlay";
    overlay.classList.add("is-hidden");
    overlay.style.backgroundColor = this.overlayBgColor + "80";
    overlay.innerHTML = this.getContent();
    const body = document.querySelector("body");
    const closeButton = overlay.querySelector(".engrid-close");
    closeButton.addEventListener("click", this.close.bind(this));
    overlay.addEventListener("click", (e) => {
      if (e.target.id == this.overlayID) {
        this.close(e);
      }
    });
    document.addEventListener("keyup", (e) => {
      if (e.key === "Escape") {
        closeButton.click();
      }
    });
    this.overlay = overlay;
    body.insertBefore(overlay, body.firstChild);
  }
  getContent() {
    console.log("iFrameLightbox getContent");
    let content = "";
    content = `<div class="engrid-content" style="background-color: ${this.contentBgColor}; max-width: ${this.maxWidth}">
                <a href="#" class="engrid-close"></a>
                <iframe id="engrid-iframe" src="${this.url}" frameborder="0" scrolling="no" allowfullscreen></iframe>
               </div>
    `;
    return content;
  }
  open() {
    this.overlay.classList.remove("is-hidden");
    document.body.classList.add("has-engrid-modal");
  }
  close(e) {
    e.preventDefault();
    crumbs.set("engridLightbox", 1, { type: "day", value: 1 }); // Create one day cookie
    this.overlay.classList.add("is-hidden");
    document.body.classList.remove("has-engrid-modal");
  }
}
