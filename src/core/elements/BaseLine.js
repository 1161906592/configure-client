import { typeEnum } from "../enums";
import { BaseLinkLine } from "./BaseLinkLine";
import { extend } from "../helpers";

function BaseLine(opts) {
  BaseLinkLine.call(this, opts);
}

BaseLine.prototype = {
  constructor: BaseLine,

  type: typeEnum.line,

  points: [
    [0, 0],
    [0, 0]
  ],

  color: "#000",

  useArrow: false,

  makeDirectionPoints() {
    return this.points;
  },

  export() {
    return {
      ...BaseLinkLine.prototype.export.call(this)
    };
  }
};

extend(BaseLine, BaseLinkLine);

export { BaseLine };
