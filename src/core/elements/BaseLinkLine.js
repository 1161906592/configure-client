import { Element } from "../Element";
import { extend, lastItem, mixin } from "../helpers";
import { typeEnum } from "../enums";
import { createElement } from "../createElement";
import { Resizable } from "@/core/mixins/Resizable";

// 所有连接线的抽象类
function BaseLinkLine(opts) {
  Element.call(this, opts);
  Resizable.call(this, opts);
}

BaseLinkLine.prototype = {
  constructor: BaseLinkLine,

  points: [],

  isLinkLine: true,

  useArrow: false,

  create() {
    this.useArrow && this.addArrow();
  },

  mount(root) {
    Element.prototype.mount.call(this, root);
    this.arrow && this.arrow.mount(this.root);
  },

  unmount() {
    Element.prototype.unmount.call(this);
    this.startElement.removeLine(this);
    this.endElement.removeLine(this);
    this.removeArrow();
  },

  update() {
    // 画线的时候不能更新拐点
    !this.isDrawing && this.syncBreakPoints();
    Element.prototype.update.call(this);
    Resizable.prototype.updateVertexes.call(this);
    this.useArrow ? this.addArrow() : this.removeArrow();
    this.arrow?.asyncWithLine();
  },

  // Interface 返回表示线的方向的两个点
  makeDirectionPoints() {},

  followVertexElement(newPoint) {
    const points = this.points;
    points[this.isFollowStart ? 0 : points.length - 1] = newPoint;

    this.update();
  },

  // Interface 调整拐点
  syncBreakPoints() {},

  addArrow() {
    if (this.arrow) return;
    const [start, end] = this.makeDirectionPoints();
    this.arrow = createElement({
      type: typeEnum.arrow,
      platform: this.platform,
      x: end[0],
      y: end[1],
      rotation: calcRotation(start, end),
      line: this
    });
    this.isMounted && this.arrow.mount(this.root);
  },

  makeRotation() {
    const [start, end] = this.makeDirectionPoints();
    return calcRotation(start, end);
  },

  removeArrow() {
    if (!this.arrow || !this.arrow.isMounted) return;
    this.arrow.unmount();
  },

  makeRectVertexes() {
    return [this.points[0], lastItem(this.points)];
  },

  updateShapeByVertex(vertex) {
    resize.call(this, vertex);
  },

  export() {
    return {
      ...Element.prototype.export.call(this),
      points: this.points,
      startId: this.startElement.id,
      startSin: this.startSin,
      startCos: this.startCos,
      endId: this.endElement.id,
      endSin: this.endSin,
      endCos: this.endCos,
      useArrow: this.useArrow,
      isLinkLine: this.isLinkLine
    };
  }
};

extend(BaseLinkLine, Element);
mixin(BaseLinkLine, Resizable);

function calcRotation(p1, p2) {
  return Math.atan2(p1[1] - p2[1], p2[0] - p1[0]) - Math.PI / 2;
}

function resize(vertex) {
  this.isFollowStart = vertex.index === 0;
  if (vertex.index === 0) {
    // 起始点
    const newStart = this.startElement.makeLineStartPoint([vertex.x, vertex.y]);
    this.points[0] = newStart.point;
    this.startSin = newStart.sin;
    this.startCos = newStart.cos;
  } else {
    // 结束点
    const newEnd = this.endElement.makeLineEndPoint(lastItem(this.points, 2), [vertex.x, vertex.y]);
    if (newEnd) {
      this.points[this.points.length - 1] = newEnd.point;
      this.endSin = newEnd.sin;
      this.endCos = newEnd.cos;
    }
  }
  this.update();
}

export { BaseLinkLine };
