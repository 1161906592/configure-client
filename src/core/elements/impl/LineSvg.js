import { platformEnum } from "../../enums";
import { createSvgNode, extend, fixZrCoordinate } from "../../helpers";
import { BaseLine } from "../BaseLine";
import { createAnimateNode, makeAnimatePath } from "./helpers";

function LineSvg(opts) {
  BaseLine.call(this, opts);
}

LineSvg.prototype = {
  constructor: LineSvg,

  platform: platformEnum.svg,

  create() {
    BaseLine.prototype.create.call(this);

    this.el = createSvgNode("g");
    this.el.style.cursor = "pointer";

    this.lineEl = createSvgNode("line");

    this.el.appendChild(this.lineEl);

    this.animateNode = createAnimateNode(this);
    this.el.appendChild(this.animateNode);

    this.mapToView();
  },

  mapToView() {
    const [[x1, y1], [x2, y2]] = this.points;

    this.lineEl.setAttribute("x1", fixZrCoordinate(x1));
    this.lineEl.setAttribute("y1", fixZrCoordinate(y1));
    this.lineEl.setAttribute("x2", fixZrCoordinate(x2));
    this.lineEl.setAttribute("y2", fixZrCoordinate(y2));
    this.lineEl.setAttribute("stroke", this.color);
    this.lineEl.setAttribute("stroke-width", 1);

    this.animateNode.setAttribute("cx", x1);
    this.animateNode.setAttribute("cy", y1);
    this.animateMotion.setAttribute("path", makeAnimatePath(this));
  }
};

extend(LineSvg, BaseLine);

export { LineSvg };
