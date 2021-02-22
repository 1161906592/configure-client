import { Element } from "../Element";
import { typeEnum } from "../enums";
import { extend, mixin } from "../helpers";
import { Draggable } from "../mixins/Draggable";
import { Container } from "../mixins/Container";
import { Resizable } from "@/core/mixins/Resizable";

function BaseCircle(opts) {
  Element.call(this, opts);
  Draggable.call(this, opts);
  Container.call(this, opts);
  Resizable.call(this, opts);
}

BaseCircle.prototype = {
  constructor: BaseCircle,

  type: typeEnum.circle,

  r: 30,

  borderWidth: 1,

  hasImage: false,

  mount(root) {
    Element.prototype.mount.call(this, root);
    Container.prototype.mount.call(this, root);
  },

  update() {
    Element.prototype.update.call(this);
    Container.prototype.update.call(this);
    Resizable.prototype.updateVertexes.call(this);
  },

  makeRectVertexes() {
    return makeRectVertexes.call(this);
  },

  updateShapeByVertex(vertex) {
    this.attr([resizeT, resizeR, resizeB, resizeL][vertex.index].call(this, vertex));
  },

  makeLineStartPoint(point) {
    return makeLineStartPoint.call(this, point);
  },

  makeLineEndPoint(point1, point2) {
    return makeLineEndPoint.call(this, point1, point2);
  },

  makeLineVertexByAngle(sin, cos) {
    return makeLineVertexByAngle.call(this, sin, cos);
  },

  unmount() {
    Element.prototype.unmount.call(this);
    Container.prototype.clearLine.call(this);
  },

  export() {
    return {
      ...Element.prototype.export.call(this),
      ...Container.prototype.export.call(this),
      r: this.r,
      image: this.image
    };
  }
};

extend(BaseCircle, Element);
mixin(BaseCircle, Draggable);
mixin(BaseCircle, Container);
mixin(BaseCircle, Resizable);

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

function makeLineStartPoint([x, y]) {
  const er = Math.sqrt((x - this.x) ** 2 + (y - this.y) ** 2);

  const sin = (y - this.y) / er;
  const cos = (x - this.x) / er;

  return { point: makeLineVertexByAngle.call(this, sin, cos), sin, cos };
}

function makeLineEndPoint(point1, point2) {
  const point = calcLineCross.call(this, point1, point2);

  if (!point) return;
  const sin = (point[1] - this.y) / this.r;
  const cos = (point[0] - this.x) / this.r;

  return { point: makeLineVertexByAngle.call(this, sin, cos), sin, cos };
}

function calcLineCross([x1, y1], [x2, y2]) {
  if (x1 === x2) {
    if (y1 < this.y - this.r) {
      return [x1, this.y - Math.sqrt(this.r ** 2 - (this.x - x1) ** 2)];
    } else {
      return [x1, this.y + Math.sqrt(this.r ** 2 - (this.x - x1) ** 2)];
    }
  }
  const k = (y2 - y1) / (x2 - x1);
  const b = y1 - k * x1;
  const c = -this.x;
  const d = -this.y;
  const r = this.r;

  const sqrt = Math.sqrt((k ** 2 + 1) * r ** 2 - c ** 2 * k ** 2 + 2 * c * (b + d) * k - d ** 2 - 2 * b * d - b ** 2);
  const a2 = k ** 2 + 1;
  const b1 = (b + d) * k + c;

  const x11 = -(b1 + sqrt) / a2;
  const y11 = k * x11 + b;
  if (x1 < x11) {
    return [x11, y11];
  }
  const x22 = -(b1 - sqrt) / a2;
  const y22 = k * x22 + b;
  if (x1 > x22) {
    return [x22, y22];
  }
}

function resizeT(vertex) {
  const r = (this.y + this.r - vertex.y) / 2;
  return {
    y: this.y + this.r - r,
    r: r
  };
}

function resizeR(vertex) {
  const r = (vertex.x - this.x + this.r) / 2;
  return {
    r: r,
    x: this.x - this.r + r
  };
}

function resizeB(vertex) {
  const r = (vertex.y - this.y + this.r) / 2;
  return {
    r: r,
    y: this.y - this.r + r
  };
}

function resizeL(vertex) {
  const r = (this.x + this.r - vertex.x) / 2;
  return {
    x: this.x + this.r - r,
    r: r
  };
}

export { BaseCircle };
