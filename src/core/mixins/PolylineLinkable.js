import { createElement, platformEnum, typeEnum } from "..";
import { lastItem, mixin } from "../helpers";
import { BaseLinkable } from "./BaseLinkable";

function PolylineLinkable() {
  BaseLinkable.call(this);
}

PolylineLinkable.prototype = {
  constructor: PolylineLinkable,

  addDrawPolyLine() {
    this.addDrawLinkLine();
    this.makeLinkLine = PolylineLinkable.prototype.makeLinkLine;
    this.lineDrawing = PolylineLinkable.prototype.lineDrawing;
  },

  makeLinkLine(e) {
    const { point, sin, cos } = this.makeLineStartPoint([e.offsetX, e.offsetY]);
    const line = createElement({
      type: typeEnum.polyline,
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
      const last = lastItem(points, 2);
      points[points.length - 1] = Math.abs(e.offsetY - last[1]) > Math.abs(e.offsetX - last[0]) ? [last[0], e.offsetY] : [e.offsetX, last[1]];
    }
    curDrawLine.mapToView();
  }
};

mixin(PolylineLinkable, BaseLinkable);

export { PolylineLinkable };
