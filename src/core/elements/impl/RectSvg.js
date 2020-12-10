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
    this.el = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.el.setAttribute("fill", "rgba(0,0,0,0)");
    this.el.setAttribute("stroke-width", 1);
    this.el.setAttribute("stroke", "rgb(0,0,0)");
    this.el.setAttribute("x", "rgb(0,0,0)");
    this.el.style.cursor = "pointer";

    this.rectEl = createSvgNode("rect");

    this.el.appendChild(this.rectEl);

    this.toggleImage();

    this.mapToView();
  },

  mapToView() {
    this.toggleImage();

    setShape.call(this, this.rectEl);
    this.imageEl && setShape.call(this, this.imageEl);
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
  el.setAttribute("x", fixZrCoordinate(this.x + (this.width < 0 ? this.width : 0)));
  el.setAttribute("y", fixZrCoordinate(this.y + (this.height < 0 ? this.height : 0)));
  el.setAttribute("width", Math.abs(this.width));
  el.setAttribute("height", Math.abs(this.height));
}

export { RectSvg };
