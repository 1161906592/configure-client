import { createElement, platformEnum, typeEnum } from "..";
import { lastItem, mixin } from "../helpers";
import { BaseLinkable } from "./BaseLinkable";

function PolylineLinkable() {
  BaseLinkable.call(this);
}

PolylineLinkable.prototype = {
  constructor: PolylineLinkable,

  addDrawPolyLine() {
    BaseLinkable.prototype.addDrawLinkLine.call(this);
    this.makeLinkLine = PolylineLinkable.prototype.makeLinkLine;
    this.lineDrawing = PolylineLinkable.prototype.lineDrawing;
  },

  makeLinkLine(e) {
    const { point, sin, cos } = this.makeLineStartPoint(e);
    const line = createElement({
      type: typeEnum.polyline,
      platform: platformEnum.zr,
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
      const last = lastItem(points, 2);
      root.isCurLineVertical = Math.abs(e.offsetY - last[1]) > Math.abs(e.offsetX - last[0]);
      points[points.length - 1] = root.isCurLineVertical ? [last[0], e.offsetY] : [e.offsetX, last[1]];
    }
    curDrawLine.update();
  }
};

mixin(PolylineLinkable, BaseLinkable);

export { PolylineLinkable };