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
    this.trigger = scriptTag.getAttribute("data-engrid-trigger") || false;
    this.triggered = false;
    if (this.url && this.shouldRun()) {
      this.init();
      return;
    }
    console.log("iFrameLightbox Should Not Run");
  }
  init() {
    console.log("iFrameLightbox init");
    this.createLightbox();
    this.triggerLightbox();
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
  getTriggerType(trigger) {
    /**
     * Any integer (e.g., 5) -> Number of seconds to wait before triggering the lightbox
     * Any pixel (e.g.: 100px) -> Number of pixels to scroll before trigger the lightbox
     * Any percentage (e.g., 30%) -> Percentage of the height of the page to scroll before triggering the lightbox
     * The word exit -> Triggers the lightbox when the mouse leaves the DOM area (exit intent).
     * With 0 as default, the lightbox will trigger as soon as the page finishes loading.
     */
    console.log("Trigger Value: ", trigger);

    if (!isNaN(trigger)) {
      return "seconds";
    } else if (trigger.includes("px")) {
      return "pixels";
    } else if (trigger.includes("%")) {
      return "percent";
    } else if (trigger.includes("exit")) {
      return "exit";
    } else {
      return false;
    }
  }
  scrollTriggerPx(e) {
    const triggerValue = Number(this.trigger.replace("px", ""));
    if (window.scrollY >= triggerValue && !this.triggered) {
      this.open();
      this.triggered = true;
    }
  }
  scrollTriggerPercent(e) {
    const triggerValue = Number(this.trigger.replace("%", ""));
    const clientHeight = document.documentElement.clientHeight;
    const scrollHeight = document.documentElement.scrollHeight - clientHeight;
    const target = (triggerValue / 100) * scrollHeight;
    if (window.scrollY >= target && !this.triggered) {
      this.open();
      this.triggered = true;
    }
  }
  triggerLightbox() {
    console.log("iFrameLightbox triggerLightbox");
    const triggerType = this.getTriggerType(this.trigger);
    console.log("Trigger type: ", triggerType);
    if (triggerType === false) {
      this.trigger = 500;
    }
    if (triggerType === "seconds") {
      this.trigger = Number(this.trigger) * 1000;
    }
    if (triggerType === "seconds" || triggerType === false) {
      window.setTimeout(this.open.bind(this), this.trigger);
    }
    if (triggerType === "exit") {
      document.body.addEventListener("mouseout", (e) => {
        if (e.clientY < 0 && !this.triggered) {
          this.open();
          this.triggered = true;
        }
      });
    }
    if (triggerType === "pixels") {
      document.addEventListener(
        "scroll",
        this.scrollTriggerPx.bind(this),
        true
      );
    }
    if (triggerType === "percent") {
      document.addEventListener(
        "scroll",
        this.scrollTriggerPercent.bind(this),
        true
      );
    }
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
