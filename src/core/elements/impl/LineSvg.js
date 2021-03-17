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

    this.lineEl = createSvgNode("polyline");

    this.el.appendChild(this.lineEl);

    this.animateNode = createAnimateNode(this);
    this.el.appendChild(this.animateNode);

    this.mapToView();
  },

  mapToView() {
    const [x1, y1] = this.points[0];

    this.lineEl.setAttribute(
      "points",
      fixCoordinate(this.points)
        .map(d => d.join(","))
        .join(" ")
    );
    this.lineEl.setAttribute("stroke", this.color);
    this.lineEl.setAttribute("stroke-width", 1);
    this.lineEl.setAttribute("fill", "none");

    this.animateNode.setAttribute("cx", x1);
    this.animateNode.setAttribute("cy", y1);
    this.animateMotion.setAttribute("path", makeAnimatePath(this));
  }
};

extend(LineSvg, BaseLine);

function fixCoordinate(points) {
  return points.map(([x, y]) => {
    return [fixZrCoordinate(x), fixZrCoordinate(y)];
  });
}

export { LineSvg };
