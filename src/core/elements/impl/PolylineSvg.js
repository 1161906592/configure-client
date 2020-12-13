import { platformEnum } from "../../enums";
import { createSvgNode, extend, fixZrCoordinate } from "../../helpers";
import { BasePolyline } from "../BasePolyline";
import { createAnimateNode, makeAnimatePath } from "./helpers";

function PolylineSvg(opts) {
  BasePolyline.call(this, opts);
}

PolylineSvg.prototype = {
  constructor: PolylineSvg,

  platform: platformEnum.svg,

  create() {
    BasePolyline.prototype.create.call(this);

    this.el = createSvgNode("g");
    this.el.style.cursor = "pointer";

    this.polylineEl = createSvgNode("polyline");

    this.el.appendChild(this.polylineEl);

    this.animateNode = createAnimateNode(this);
    this.el.appendChild(this.animateNode);

    this.mapToView();
  },

  mapToView() {
    this.polylineEl.setAttribute(
      "points",
      fixCoordinate(this.points)
        .map(d => d.join(","))
        .join(" ")
    );
    this.polylineEl.setAttribute("stroke", this.color);
    this.polylineEl.setAttribute("stroke-width", 1);
    this.polylineEl.setAttribute("fill", "none");

    this.animateNode.setAttribute("cx", this.points[0][0]);
    this.animateNode.setAttribute("cy", this.points[0][1]);
    this.animateMotion.setAttribute("path", makeAnimatePath(this));
  }
};

extend(PolylineSvg, BasePolyline);

function fixCoordinate(points) {
  return points.map(([x, y]) => {
    return [fixZrCoordinate(x), fixZrCoordinate(y)];
  });
}

export { PolylineSvg };
