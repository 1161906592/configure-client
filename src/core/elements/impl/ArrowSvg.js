import { createSvgNode, extend } from "../../helpers";
import { platformEnum } from "../../enums";
import { BaseArrow } from "../BaseArrow";

function ArrowSvg(opts) {
  BaseArrow.call(this, opts);
}

ArrowSvg.prototype = {
  constructor: ArrowSvg,

  platform: platformEnum.svg,

  create() {
    this.el = createSvgNode("polygon");
    this.mapToView();
  },

  mapToView() {
    fixArrowCenter(this);
    const el = this.el;
    el.setAttribute(
      "points",
      makePoints
        .call(this)
        .map(d => d.join(","))
        .join(" ")
    );
    el.setAttribute("fill", this.fill);
    el.setAttribute("transform", `rotate(${(-this.rotation * 180) / Math.PI}, ${this.x},${this.y})`);
  }
};

extend(ArrowSvg, BaseArrow);

function fixArrowCenter(arrow) {
  let { rotation, r } = arrow;
  arrow.x += r * Math.sin(rotation);
  arrow.y += r * Math.cos(rotation);
}

const tan = Math.tan(Math.PI / 6);

function makePoints() {
  return [
    [this.x, this.y - this.r],
    [this.x + this.r * 1.5 * tan, this.y + this.r / 2],
    [this.x - this.r * 1.5 * tan, this.y + this.r / 2]
  ];
}

export { ArrowSvg };
