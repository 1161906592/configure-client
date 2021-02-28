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
    // 绘制过程中被移除时没有 endElement
    this.endElement?.removeLine(this);
    this.removeArrow();
  },

  update() {
    Element.prototype.update.call(this);
    this.updateVertexes();
    this.useArrow ? this.addArrow() : this.removeArrow();
    this.arrow?.asyncWithLine();
  },

  // Interface 返回表示线的方向的两个点
  makeDirectionPoints() {},

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
    return this.points;
  },

  updateShapeByVertex(vertex) {
    this.updatePoint(vertex.index, [vertex.x, vertex.y]);
  },

  updatePoint(index, point) {
    updatePoint.call(this, index, point);
    this.update();
  },

  // 绘制过程中键盘控制
  keyCtrlDrawing(e) {
    if (e.key === "z" && e.ctrlKey) {
      this.root.isNewPoint = false;
      if (this.points.length === 2) {
        this.unmount();
        this.root.curDrawLine = null;
      } else {
        this.points.pop();
        this.mapToView();
      }
    }
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

export function updatePoint(index, point) {
  if (index === 0) {
    // 起点
    const newStart = this.startElement.makeLineStartPoint(point);
    this.points[0] = newStart.point;
    this.startSin = newStart.sin;
    this.startCos = newStart.cos;
  } else if (index === this.points.length - 1) {
    // 终点
    const newEnd = this.endElement.makeLineEndPoint(lastItem(this.points, 2), point);
    if (newEnd) {
      this.points[this.points.length - 1] = newEnd.point;
      this.endSin = newEnd.sin;
      this.endCos = newEnd.cos;
    }
  } else {
    this.points[index] = point;
  }
}

export { BaseLinkLine };
