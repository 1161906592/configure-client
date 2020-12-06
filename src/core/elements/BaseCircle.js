import { Element } from "../Element";
import { typeEnum } from "../enums";
import { extend, mixin } from "../helpers";
import { Draggable } from "../mixins/Draggable";
import { Container } from "../mixins/Container";

function BaseCircle(opts) {
  Element.call(this, opts);
  Draggable.call(this, opts);
  Container.call(this, opts);
}

BaseCircle.prototype = {
  constructor: BaseCircle,

  type: typeEnum.circle,

  r: 30,
  borderWidth: 1,

  follow(offset) {
    Element.prototype.follow.call(this, offset);
    Container.prototype.follow.call(this, offset);
  },

  makeRectVertexes() {
    return makeRectVertexes.call(this);
  },

  followVertex(vertex, offset) {
    Container.prototype.followVertex.call(this, vertex, offset);
    Container.prototype.updateLines.call(this);
  },

  makeLineStartPoint(e) {
    return makeLineStartPoint.call(this, e);
  },

  makeLineEndPoint(e) {
    return makeLineEndPoint.call(this, e);
  },

  makeLineVertexByAngle(sin, cos) {
    return makeLineVertexByAngle.call(this, sin, cos);
  },

  updateShape(vertex, offset) {
    [resizeT, resizeR, resizeB, resizeL][vertex.index](this, offset);
    this.update();
  },

  unmount() {
    Element.prototype.unmount.call(this);
    Container.prototype.clearLine.call(this);
  },

  exportStruct() {
    return {
      ...Element.prototype.exportStruct.call(this),
      r: this.r,
      image: this.image,
      lines: Container.prototype.exportStruct.call(this)
    };
  }
};

extend(BaseCircle, Element);
mixin(BaseCircle, Draggable);
mixin(BaseCircle, Container);

function makeRectVertexes() {
  return [
    [this.x, this.y - this.r],
    [this.x + this.r, this.y],
    [this.x, this.y + this.r],
    [this.x - this.r, this.y]
  ];
}

function makeLineVertexByAngle(sin, cos) {
  const r = Math.abs(this.r);
  const x = ~~(this.x + r * cos) + 0.5;
  const y = ~~(this.y + r * sin) + 0.5;
  return [x, y];
}

function makeLineStartPoint(e) {
  const er = Math.sqrt((e.offsetX - this.x) ** 2 + (e.offsetY - this.y) ** 2);

  const sin = (e.offsetY - this.y) / er;
  const cos = (e.offsetX - this.x) / er;

  return { point: makeLineVertexByAngle.call(this, sin, cos), sin, cos };
}

function makeLineEndPoint(last2) {
  const center = [this.x, this.y];

  let sin;
  let cos;
  if (this.root.isCurLineVertical) {
    cos = (last2[0] - center[0]) / this.r;
    sin = Math.sqrt(1 - cos ** 2);
    if (last2[1] < this.y) {
      sin = -sin;
    }
  } else {
    sin = (last2[1] - center[1]) / this.r;
    cos = Math.sqrt(1 - sin ** 2);
    if (last2[0] < this.x) {
      cos = -cos;
    }
  }

  return { point: makeLineVertexByAngle.call(this, sin, cos), sin, cos };
}

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
