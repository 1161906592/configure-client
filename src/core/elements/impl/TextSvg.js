import { Element } from "../../Element";
import { createSvgNode, extend } from "../../helpers";
import { platformEnum, typeEnum } from "../../enums";

function TextSvg(opts) {
  Element.call(this, opts);
}

TextSvg.prototype = {
  constructor: TextSvg,

  type: typeEnum.text,

  platform: platformEnum.svg,

  text: "文字",

  create() {
    this.el = createSvgNode("text");

    this.tspan = createSvgNode("tspan");

    this.tspan.setAttribute("text-anchor", "middle");
    this.tspan.setAttribute("dominant-baseline", "middle");

    this.el.appendChild(this.tspan);

    this.mapToView();
  },

  mapToView() {
    const el = this.el;
    el.setAttribute("x", this.x);
    el.setAttribute("y", this.y);
    this.tspan.textContent = this.text;
    el.style.cursor = "pointer";
  },

  export() {
    return {
      ...Element.prototype.export.call(this),
      text: this.text
    };
  }
};

extend(TextSvg, Element);

export { TextSvg };
