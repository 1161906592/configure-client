import { createSvgNode } from "../helpers";

function CircleImplSvg() {}

CircleImplSvg.prototype = {
  constructor: CircleImplSvg,

  create() {
    this.el = createSvgNode("circle");

    this.mapToView();
  },

  mapToView() {
    const { el } = this;

    el.setAttribute("cx", ~~this.x + 0.5);
    el.setAttribute("cy", ~~this.y + 0.5);
    el.setAttribute("r", Math.abs(this.r));
    el.setAttribute("fill", this.fill);
    el.setAttribute("stroke-width", 1);
    el.setAttribute("stroke", "rgb(0,0,0)");
    el.style.cursor = "pointer";
  }
};

export { CircleImplSvg };
