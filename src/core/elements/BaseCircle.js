import { Element, typeEnum } from "../Element";
import { extend, mixin } from "../helpers";
import { Resize } from "../mixins/Resize";

export function BaseCircle(opts) {
  Element.call(this, opts);
  Resize.call(this, opts);
  this.type = typeEnum.circle;
  this.shape = {
    x: 0,
    y: 0,
    r: 32,
    ...this.shape
  };
}

BaseCircle.prototype = {
  constructor: BaseCircle,

  follow(offset) {
    Element.prototype.follow.call(this, offset);
    Resize.prototype.follow.call(this, offset);
  },

  makeRectVertexes() {
    const shape = this.shape;
    return [
      [shape.x, shape.y - shape.r],
      [shape.x + shape.r, shape.y],
      [shape.x, shape.y + shape.r],
      [shape.x - shape.r, shape.y]
    ];
  },

  followVertex(vertex, offset) {
    Resize.prototype.followVertex.call(this, vertex, offset);
  },

  updateShape(vertex, offset) {
    [resizeT, resizeR, resizeB, resizeL][vertex.index](this, offset);
    this.setShape(this.shape);
  }
};

extend(BaseCircle, Element);
mixin(BaseCircle, Resize);

function resizeT(circle, offset) {
  const shape = circle.shape;
  shape.y += offset.y / 2;
  shape.r -= offset.y / 2;
}

function resizeR(circle, offset) {
  const shape = circle.shape;
  shape.x += offset.x / 2;
  shape.r += offset.x / 2;
}

function resizeB(circle, offset) {
  const shape = circle.shape;
  shape.y += offset.y / 2;
  shape.r += offset.y / 2;
}

function resizeL(circle, offset) {
  const shape = circle.shape;
  shape.x += offset.x / 2;
  shape.r -= offset.x / 2;
}
