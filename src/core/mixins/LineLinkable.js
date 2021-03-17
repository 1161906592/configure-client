import { mixin } from "../helpers";
import { BaseLinkable } from "./BaseLinkable";
import { createElement, platformEnum, typeEnum } from "..";

function LineLinkable() {
  BaseLinkable.call(this);
}

LineLinkable.prototype = {
  constructor: LineLinkable,

  addDrawLine() {
    this.addDrawLinkLine();
    this.makeLinkLine = LineLinkable.prototype.makeLinkLine;
    this.lineDrawing = LineLinkable.prototype.lineDrawing;
  },

  makeLinkLine(e) {
    const { point, sin, cos } = this.makeLineStartPoint([e.offsetX, e.offsetY]);
    const line = createElement({
      type: typeEnum.line,
      platform: platformEnum.svg,
      points: [point]
    });
    return { line, sin, cos };
  },

  // Interface 画线过程中
  lineDrawing(e) {
    const root = this.root;
    const curDrawLine = root.curDrawLine;
    if (!curDrawLine) return;
    const points = curDrawLine.points;
    if (root.isNewPoint) {
      root.isNewPoint = false;
      points.push([e.offsetX, e.offsetY]);
    } else {
      points[points.length - 1] = [e.offsetX, e.offsetY];
    }
    curDrawLine.mapToView();
  }
};

mixin(LineLinkable, BaseLinkable);

export { LineLinkable };
