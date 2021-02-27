import { Element } from "../Element";
import { typeEnum } from "../enums";
import { extend, mixin } from "../helpers";
import { Draggable } from "../mixins/Draggable";
import { Container } from "../mixins/Container";
import { Resizable } from "@/core/mixins/Resizable";

function BaseRect(opts) {
  Element.call(this, opts);
  Container.call(this, opts);
  Resizable.call(this, opts);
}

BaseRect.prototype = {
  constructor: BaseRect,

  type: typeEnum.rect,

  width: 200,

  height: 100,

  r: 4,

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

  unmount() {
    Element.prototype.unmount.call(this);
    Container.prototype.unmount.call(this);
  },

  makeRectVertexes() {
    return makeRectVertexes.call(this);
  },

  updateShapeByVertex(vertex) {
    this.attr(
      [resizeRectLT, resizeRectT, resizeRectRT, resizeRectR, resizeRectRB, resizeRectB, resizeRectLB, resizeRectL][vertex.index].call(this, vertex)
    );
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

  export() {
    return {
      ...Element.prototype.export.call(this),
      ...Container.prototype.export.call(this),
      width: this.width,
      height: this.height,
      r: this.r,
      image: this.image
    };
  }
};

extend(BaseRect, Element);
mixin(BaseRect, Draggable);
mixin(BaseRect, Container);
mixin(BaseRect, Resizable);

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

function makeLineStartPoint([x, y]) {
  const centerX = this.x + this.width / 2;
  const centerY = this.y + this.height / 2;

  const er = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
  const sin = (y - centerY) / er;
  const cos = (x - centerX) / er;

  return { point: makeLineVertexByAngle.call(this, sin, cos), sin, cos };
}

function makeLineEndPoint(point1, point2) {
  const point = calcLineCross.call(this, point1, point2);

  if (!point) return;
  const center = [this.x + this.width / 2, this.y + this.height / 2];
  const r = Math.sqrt((point[0] - center[0]) ** 2 + (point[1] - center[1]) ** 2);

  const sin = (point[1] - center[1]) / r;
  const cos = (point[0] - center[0]) / r;

  return { point: point, sin, cos };
}

// 计算直线与矩形的交点
function calcLineCross([x1, y1], [x2, y2]) {
  if (x1 === x2) {
    const x = Math.min(Math.max(this.x, x1), this.x + this.width);
    if (y1 < this.y) {
      return [x, this.y];
    } else {
      return [x, this.y + this.height];
    }
  } else {
    // y = k * x + b
    const k = (y2 - y1) / (x2 - x1);
    const b = y1 - k * x1;
    const cross1 = [(this.y - b) / k, this.y]; // 上边交点
    if (y1 < this.y && cross1[0] >= this.x && cross1[0] <= this.x + this.width) {
      return cross1;
    }
    const cross2 = [this.x + this.width, k * (this.x + this.width) + b]; // 右边交点
    if (x1 > this.x + this.width && cross2[1] >= this.y && cross2[1] <= this.y + this.height) {
      return cross2;
    }
    const cross3 = [(this.y + this.height - b) / k, this.y + this.height]; // 下边交点
    if (y1 > this.y + this.height && cross3[0] >= this.x && cross3[0] <= this.x + this.width) {
      return cross3;
    }
    const cross4 = [this.x, k * this.x + b]; // 左边交点
    if (x1 < this.x && cross4[1] >= this.y && cross4[1] <= this.y + this.height) {
      return cross4;
    }
  }
}

// 左上
function resizeRectLT(vertex) {
  return {
    x: vertex.x,
    y: vertex.y,
    width: this.width + this.x - vertex.x,
    height: this.height + this.y - vertex.y
  };
}

// 上
function resizeRectT(vertex) {
  return {
    y: vertex.y,
    height: this.height + this.y - vertex.y
  };
}

// 右上
function resizeRectRT(vertex) {
  return {
    width: vertex.x - this.x,
    y: vertex.y,
    height: this.height + this.y - vertex.y
  };
}

// 右
function resizeRectR(vertex) {
  return {
    width: vertex.x - this.x
  };
}

// 右下
function resizeRectRB(vertex) {
  return {
    width: vertex.x - this.x,
    height: vertex.y - this.y
  };
}

// 下
function resizeRectB(vertex) {
  return {
    height: vertex.y - this.y
  };
}

// 左下
function resizeRectLB(vertex) {
  return {
    x: vertex.x,
    width: this.width + this.x - vertex.x,
    height: vertex.y - this.y
  };
}

// 左
function resizeRectL(vertex) {
  return {
    x: vertex.x,
    width: this.width + this.x - vertex.x
  };
}

export { BaseRect };
