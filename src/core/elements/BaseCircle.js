import { Element, typeEnum } from "../Element";
import { extend, mixin } from "../helpers";
import { Resize } from "../mixins/Resize";

function BaseCircle(opts) {
  Element.call(this, opts);
  Resize.call(this, opts);
}

BaseCircle.prototype = {
  constructor: BaseCircle,

  type: typeEnum.circle,

  r: 30,

  follow(offset) {
    Element.prototype.follow.call(this, offset);
    Resize.prototype.follow.call(this, offset);
  },

  makeRectVertexes() {
    return [
      [this.x, this.y - this.r],
      [this.x + this.r, this.y],
      [this.x, this.y + this.r],
      [this.x - this.r, this.y]
    ];
  },

  followVertex(vertex, offset) {
    Resize.prototype.followVertex.call(this, vertex, offset);
  },

  updateShape(vertex, offset) {
    [resizeT, resizeR, resizeB, resizeL][vertex.index](this, offset);
    this.dirty();
  },

  exportStruct() {
    return {
      ...Element.prototype.exportStruct.call(this),
      r: this.r
    };
  }
};

extend(BaseCircle, Element);
mixin(BaseCircle, Resize);

function resizeT(circle, offset) {
  circle.y += offset.y / 2;
  circle.r -= offset.y / 2;
}

function resizeR(circle, offset) {
  circle.x += offset.x / 2;
  circle.r += offset.x / 2;
}

function resizeB(circle, offset) {
  circle.y += offset.y / 2;
  circle.r += offset.y / 2;
}

function resizeL(circle, offset) {
  circle.x += offset.x / 2;
  circle.r -= offset.x / 2;
}

export { BaseCircle };
