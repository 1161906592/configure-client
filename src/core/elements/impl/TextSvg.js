import { Element } from "../../Element";
import { createSvgNode, extend, mixin } from "../../helpers";
import { platformEnum, typeEnum } from "../../enums";
import { Draggable } from "../../mixins/Draggable";

function TextSvg(opts) {
  Element.call(this, opts);
  Draggable.call(this, opts);
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
mixin(TextSvg, Draggable);

export { TextSvg };
