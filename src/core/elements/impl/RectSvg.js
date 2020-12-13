import { BaseRect } from "../BaseRect";
import { platformEnum } from "../../enums";
import { createSvgNode, extend, fixZrCoordinate } from "../../helpers";

function RectSvg(opts) {
  BaseRect.call(this, opts);
}

RectSvg.prototype = {
  constructor: RectSvg,

  platform: platformEnum.svg,

  create() {
    this.el = createSvgNode("g");
    this.el.setAttribute("fill", "rgba(0,0,0,0)");
    this.el.setAttribute("stroke-width", 1);
    this.el.setAttribute("stroke", "rgb(0,0,0)");
    this.el.setAttribute("x", "rgb(0,0,0)");
    this.el.style.cursor = "pointer";

    if (!this.preview) {
      this.rectEl = createSvgNode("rect");

      this.el.appendChild(this.rectEl);
    }

    this.toggleImage();

    this.foreignObjectElement = createSvgNode("foreignObject");

    this.el.insertBefore(this.foreignObjectElement, this.rectEl);

    const div = document.createElement("div");
    this.foreignObjectElement.appendChild(div);
    div.style.height = "100%";
    div.style.overflow = "auto";
    this.domHost = document.createElement("div");
    div.appendChild(this.domHost);

    this.mapToView();
  },

  mapToView() {
    this.toggleImage();

    setShape.call(this, this.rectEl);
    setShape.call(this, this.foreignObjectElement);
    setShape.call(this, this.imageEl);
  },

  toggleImage() {
    if (this.hasImage !== !!this.image) {
      if (this.imageEl) {
        this.el.removeChild(this.imageEl);
      } else {
        this.imageEl = createSvgNode("image");
        this.imageEl.setAttribute("preserveAspectRatio", "none");
        this.imageEl.setAttribute("href", this.image);
        this.el.insertBefore(this.imageEl, this.rectEl);
      }
    }
    this.hasImage = !!this.image;
  }
};

extend(RectSvg, BaseRect);

function setShape(el) {
  if (!el) return;
  el.setAttribute("x", fixZrCoordinate(this.x + (this.width < 0 ? this.width : 0)));
  el.setAttribute("y", fixZrCoordinate(this.y + (this.height < 0 ? this.height : 0)));
  el.setAttribute("width", Math.abs(this.width));
  el.setAttribute("height", Math.abs(this.height));
}

export { RectSvg };
