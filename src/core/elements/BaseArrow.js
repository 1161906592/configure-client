import { Element } from "../Element";
import { typeEnum } from "../enums";
import { extend, lastItem } from "../helpers";

function BaseArrow(opts) {
  Element.call(this, opts);
}

BaseArrow.prototype = {
  constructor: BaseArrow,

  type: typeEnum.arrow,

  r: 6,

  fill: "#000",

  rotation: Math.PI / 2,

  asyncWithLine() {
    const last = lastItem(this.line.points);
    this.attr({
      x: last[0],
      y: last[1],
      rotation: this.line.makeRotation()
    });
  },

  ondrag() {},

  export() {}
};

extend(BaseArrow, Element);

export { BaseArrow };
