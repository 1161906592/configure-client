import { Element, typeEnum } from "../Element";
import { extend, mixin } from "../helpers";
import {
  resizeRectLT,
  resizeRectT,
  resizeRectRT,
  resizeRectR,
  resizeRectRB,
  resizeRectB,
  resizeRectLB,
  resizeRectL,
  lineFollowRectLT,
  lineFollowRectT,
  lineFollowRectRT,
  lineFollowRectR,
  lineFollowRectRB,
  lineFollowRectB,
  lineFollowRectLB,
  lineFollowRectL
} from "../handler/rectResize";
import { DrawLine } from "../mixins/DrawLine";
import { Resize } from "../mixins/Resize";

export function BaseRect(opts) {
  Element.call(this, opts);
  DrawLine.call(this, opts);
  Resize.call(this, opts);
  this.type = typeEnum.rect;
  this.shape = {
    x: 0,
    y: 0,
    width: 200,
    height: 100,
    ...this.shape
  };

  this.image = opts.image;
  this.lines = this.lines || [];
}

BaseRect.prototype = {
  constructor: BaseRect,

  follow(offset) {
    Element.prototype.follow.call(this, offset);
    Resize.prototype.follow.call(this, offset);
    const elementMap = this.root.elementMap;
    this.lines.forEach(item => {
      const line = elementMap[item.id];
      line.isFollowStart = item.isStart;
      line.followHost(offset);
    });
  },

  makeRectVertexes() {
    const shape = this.shape;
    const halfW = shape.width / 2;
    const halfH = shape.height / 2;
    return [
      [shape.x, shape.y],
      [shape.x + halfW, shape.y],
      [shape.x + shape.width, shape.y],
      [shape.x + shape.width, shape.y + halfH],
      [shape.x + shape.width, shape.y + shape.height],
      [shape.x + halfW, shape.y + shape.height],
      [shape.x, shape.y + shape.height],
      [shape.x, shape.y + halfH]
    ];
  },

  followVertex(vertex, offset) {
    Resize.prototype.followVertex.call(this, vertex, offset);
    [lineFollowRectLT, lineFollowRectT, lineFollowRectRT, lineFollowRectR, lineFollowRectRB, lineFollowRectB, lineFollowRectLB, lineFollowRectL][
      vertex.index
    ](this, offset);
  },

  updateShape(vertex, offset) {
    [resizeRectLT, resizeRectT, resizeRectRT, resizeRectR, resizeRectRB, resizeRectB, resizeRectLB, resizeRectL][vertex.index](this, offset);
    this.setShape(this.shape);
  },

  setImage(image) {
    this.image = image;
  }
};

extend(BaseRect, Element);
mixin(BaseRect, DrawLine);
mixin(BaseRect, Resize);
