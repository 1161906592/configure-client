import { mixin } from "../helpers";
import { BaseLinkable } from "./BaseLinkable";
import { createElement, platformEnum, typeEnum } from "..";

function LineLinkable() {
  BaseLinkable.call(this);
}

LineLinkable.prototype = {
  constructor: LineLinkable,

  addDrawLine() {
    BaseLinkable.prototype.addDrawLinkLine.call(this);
    this.makeLinkLine = LineLinkable.prototype.makeLinkLine;
    this.lineDrawing = LineLinkable.prototype.lineDrawing;
  },

  makeLinkLine(e) {
    const {
      point: [x, y],
      sin,
      cos
    } = this.makeLineStartPoint(e);
    const line = createElement({
      type: typeEnum.line,
      platform: platformEnum.zr,
      points: [
        [x, y],
        [x, y]
      ]
    });
    return { line, sin, cos };
  },

  // Interface 画线过程中
  lineDrawing(e) {
    const root = this.root;
    const curDrawLine = root.curDrawLine;
    if (!curDrawLine) return;
    const points = curDrawLine.points;
    points[1] = [e.offsetX, e.offsetY];
    curDrawLine.attr({
      points
    });
  }
};

mixin(LineLinkable, BaseLinkable);

export { LineLinkable };
