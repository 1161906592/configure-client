import { platformEnum } from "../../enums";
import { createSvgNode, extend, fixZrCoordinate } from "../../helpers";
import { BasePolyline } from "../BasePolyline";

function PolylineSvg(opts) {
  BasePolyline.call(this, opts);
}

PolylineSvg.prototype = {
  constructor: PolylineSvg,

  platform: platformEnum.svg,

  create() {
    BasePolyline.prototype.create.call(this);

    this.el = createSvgNode("polyline");

    this.mapToView();
  },

  mapToView() {
    const el = this.el;
    el.setAttribute(
      "points",
      fixCoordinate(this.points)
        .map(d => d.join(","))
        .join(" ")
    );
    el.setAttribute("stroke", this.color);
    el.setAttribute("stroke-width", 1);
    el.setAttribute("fill", "none");
  }
};

extend(PolylineSvg, BasePolyline);

function fixCoordinate(points) {
  return points.map(([x, y]) => {
    return [fixZrCoordinate(x), fixZrCoordinate(y)];
  });
}

export { PolylineSvg };
