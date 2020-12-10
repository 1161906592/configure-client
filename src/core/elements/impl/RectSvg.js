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
    const el = (this.el = document.createElementNS("http://www.w3.org/2000/svg", "g"));
    el.setAttribute("fill", "rgba(0,0,0,0)");
    el.setAttribute("stroke-width", 1);
    el.setAttribute("stroke", "rgb(0,0,0)");
    el.style.cursor = "pointer";
    // foreignObject.appendChild(image);

    this.toggleImage();

    this.mapToView();
  },

  mapToView() {
    this.toggleImage();

    const el = this.innerEl;
    el.setAttribute("x", fixZrCoordinate(this.x + (this.width < 0 ? this.width : 0)));
    el.setAttribute("y", fixZrCoordinate(this.y + (this.height < 0 ? this.height : 0)));
    el.setAttribute("width", Math.abs(this.width));
    el.setAttribute("height", Math.abs(this.height));
  },

  toggleImage() {
    if (this.hasImage !== !!this.image) {
      this.innerEl && this.el.removeChild(this.innerEl);
      this.innerEl = createSvgNode(this.image ? "image" : "rect");
      this.el.appendChild(this.innerEl);
      this.hasImage = !!this.image;
    }
    if (this.hasImage) {
      this.innerEl.setAttribute("preserveAspectRatio", "none");
      this.innerEl.setAttribute("href", this.image);
    }
  }
};

extend(RectSvg, BaseRect);

export { RectSvg };
