import { Element } from "../Element";
import { typeEnum } from "../enums";
import { extend, mixin } from "../helpers";
import { Draggable } from "../mixins/Draggable";
import { Container } from "../mixins/Container";

function BaseRect(opts) {
  Element.call(this, opts);
  Draggable.call(this, opts);
  Container.call(this, opts);
}

BaseRect.prototype = {
  constructor: BaseRect,

  type: typeEnum.rect,

  width: 200,

  height: 100,

  r: 4,

  update() {
    Container.prototype.updateVertexes.call(this);
  },

  follow(offset) {
    Element.prototype.follow.call(this, offset);
    Container.prototype.follow.call(this);
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
    [resizeRectLT, resizeRectT, resizeRectRT, resizeRectR, resizeRectRB, resizeRectB, resizeRectLB, resizeRectL][vertex.index].call(this, offset);
    this.update();
  },

  unmount() {
    Element.prototype.unmount.call(this);
    Container.prototype.clearLine.call(this);
  },

  exportStruct() {
    return {
      ...Element.prototype.exportStruct.call(this),
      width: this.width,
      height: this.height,
      r: this.r,
      image: this.image,
      lines: Container.prototype.exportStruct.call(this)
    };
  }
};

extend(BaseRect, Element);
mixin(BaseRect, Draggable);
mixin(BaseRect, Container);

function makeRectVertexes() {
  const halfW = this.width / 2;
  const halfH = this.height / 2;
  return [
    [this.x, this.y],
    [this.x + halfW, this.y],
    [this.x + this.width, this.y],
    [this.x + this.width, this.y + halfH],
    [this.x + this.width, this.y + this.height],
    [this.x + halfW, this.y + this.height],
    [this.x, this.y + this.height],
    [this.x, this.y + halfH]
  ];
}

function makeLineVertexByAngle(sin, cos) {
  const centerX = this.x + this.width / 2;
  const centerY = this.y + this.height / 2;

  let r1 = Math.abs(this.width / 2 / cos);
  let r2 = Math.abs(this.height / 2 / sin);

  let x;
  let y;
  if (r1 > r2) {
    x = ~~(centerX + r2 * cos) + 0.5;
    y = ~~(centerY + r2 * sin) + 0.5;
  } else {
    x = ~~(centerX + r1 * cos) + 0.5;
    y = ~~(centerY + r1 * sin) + 0.5;
  }

  return [x, y];
}

function makeLineStartPoint(e) {
  const centerX = this.x + this.width / 2;
  const centerY = this.y + this.height / 2;

  const er = Math.sqrt((e.offsetX - centerX) ** 2 + (e.offsetY - centerY) ** 2);
  const sin = (e.offsetY - centerY) / er;
  const cos = (e.offsetX - centerX) / er;

  return { point: makeLineVertexByAngle.call(this, sin, cos), sin, cos };
}

function makeLineEndPoint(last2) {
  const center = [this.x + this.width / 2, this.y + this.height / 2];

  let sin;
  let cos;
  if (this.root.isCurLineVertical) {
    const r = Math.sqrt((last2[0] - center[0]) ** 2 + (this.height / 2) ** 2);
    cos = (last2[0] - center[0]) / r;
    sin = Math.sqrt(1 - cos ** 2);
    if (last2[1] < center[1]) {
      sin = -sin;
    }
  } else {
    const r = Math.sqrt((last2[1] - center[1]) ** 2 + (this.width / 2) ** 2);
    sin = (last2[1] - center[1]) / r;
    cos = Math.sqrt(1 - sin ** 2);
    if (last2[0] < center[0]) {
      cos = -cos;
    }
  }

  return { point: makeLineVertexByAngle.call(this, sin, cos), sin, cos };
}

// 左上
function resizeRectLT(offset) {
  this.x += offset.x;
  this.y += offset.y;
  this.width -= offset.x;
  this.height -= offset.y;
}

// 上
function resizeRectT(offset) {
  this.y += offset.y;
  this.height -= offset.y;
}

// 右上
function resizeRectRT(offset) {
  // shape.x -= offset.x;
  this.width += offset.x;
  this.y += offset.y;
  this.height -= offset.y;
}

// 右
function resizeRectR(offset) {
  // shape.x -= offset.x;
  this.width += offset.x;
}

// 右下
function resizeRectRB(offset) {
  // shape.x -= offset.x;
  this.width += offset.x;
  this.height += offset.y;
}

// 下
function resizeRectB(offset) {
  // shape.y -= offset.y;
  this.height += offset.y;
}

// 左下
function resizeRectLB(offset) {
  this.x += offset.x;
  this.width -= offset.x;
  this.height += offset.y;
}

// 左
function resizeRectL(offset) {
  this.x += offset.x;
  this.width -= offset.x;
}

export { BaseRect };
