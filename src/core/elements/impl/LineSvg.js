import { platformEnum } from "../../enums";
import { createSvgNode, extend, fixZrCoordinate } from "../../helpers";
import { BaseLine } from "../BaseLine";

function LineSvg(opts) {
  BaseLine.call(this, opts);
}

LineSvg.prototype = {
  constructor: LineSvg,

  platform: platformEnum.svg,

  create() {
    BaseLine.prototype.create.call(this);

    this.el = createSvgNode("line");

    this.mapToView();
  },

  mapToView() {
    const [[x1, y1], [x2, y2]] = this.points;
    const el = this.el;
    el.setAttribute("x1", fixZrCoordinate(x1));
    el.setAttribute("y1", fixZrCoordinate(y1));
    el.setAttribute("x2", fixZrCoordinate(x2));
    el.setAttribute("y2", fixZrCoordinate(y2));
    el.setAttribute("stroke", this.color);
    el.setAttribute("stroke-width", 1);
    el.style.cursor = "pointer";
  }
};

extend(LineSvg, BaseLine);

export { LineSvg };
