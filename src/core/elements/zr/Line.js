import { platformEnum, typeEnum } from "../../enums";
import { BaseLinkLine } from "../BaseLinkLine";
import { Line as ZRLine } from "zrender";
import { extend, fixZrCoordinate } from "../../helpers";

function Line(opts) {
  BaseLinkLine.call(this, opts);
}

Line.prototype = {
  constructor: Line,

  type: typeEnum.line,

  platform: platformEnum.zr,

  points: [
    [0, 0],
    [0, 0]
  ],

  useArrow: false,

  create() {
    BaseLinkLine.prototype.create.call(this);
    const [[x1, y1], [x2, y2]] = this.points;

    this.el = new ZRLine({
      shape: { x1: fixZrCoordinate(x1), y1: fixZrCoordinate(y1), x2: fixZrCoordinate(x2), y2: fixZrCoordinate(y2) },
      style: {
        lineWidth: 1,
        stroke: "#000",
        text: "",
        fontSize: 16,
        textFill: "#999"
      }
    });
  },

  makeDirectionPoints() {
    return this.points;
  },

  mapToView() {
    const [[x1, y1], [x2, y2]] = this.points;
    this.el.setShape({ x1: fixZrCoordinate(x1), y1: fixZrCoordinate(y1), x2: fixZrCoordinate(x2), y2: fixZrCoordinate(y2) });
  },

  export() {
    return {
      ...BaseLinkLine.prototype.export.call(this)
    };
  }
};

extend(Line, BaseLinkLine);

export { Line };
