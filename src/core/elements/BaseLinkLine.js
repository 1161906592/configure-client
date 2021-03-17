import { Element } from "../Element";
import { extend, handleKeyEvent, lastItem, mixin } from "../helpers";
import { typeEnum } from "../enums";
import { createElement } from "../createElement";
import { Resizable } from "@/core/mixins/Resizable";
import { PolylineLinkable } from "@/core/mixins/PolylineLinkable";
import { LineLinkable } from "@/core/mixins/LineLinkable";

// 所有连接线的抽象类
function BaseLinkLine(opts) {
  Element.call(this, opts);
  Resizable.call(this, opts);
  PolylineLinkable.call(this, opts);
  LineLinkable.call(this, opts);
  this.zIndex = opts.zIndex || 0;
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

  makeDirectionPoints() {
    const points = this.points;
    return [lastItem(points, 2), lastItem(points)];
  },

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

  onfocus(p) {
    this.focusPoint(p);
  },

  focusPoint(p) {
    if (!p) return;
    const { index } = calcCrossIndex.call(this, p);
    this.focusIndex = index;
    this.curFocusPoint = p;
  },

  makeLineStartPoint() {
    return { point: this.points[0], sin: this.startSin, cos: this.startCos };
  },

  // 获取
  makeBeforeBreakPoints(p) {
    const { index, point } = calcCrossIndex.call(this, p);
    return [...this.points.slice(1, index + 1).map(p => [p[0], p[1]]), point];
  },

  makeLineEndPoint() {
    return { point: lastItem(this.points), sin: this.endSin, cos: this.endCos };
  },

  makeAfterBreakPoints(p) {
    const { index, point } = calcCrossIndex.call(this, p);
    return [point, ...this.points.slice(index + 1).map(p => [p[0], p[1]])];
  },

  // 插入点
  insertPoints(index, ...points) {
    this.points.splice(index, 0, ...points);
    if (this.vertexes.length) {
      // 插入时需要调整原来顶点的下标
      for (let i = index; i < this.vertexes.length; i++) {
        this.vertexes[i].index += points.length;
      }
      points.forEach((point, i) => {
        this.insertVertex(index + i, point);
      });
    }
    // 调整 focusIndex 的值
    if (this.focusIndex !== -1 && this.focusIndex >= index) {
      this.focusIndex += points.length;
    }
  },

  // 绘制过程中键盘控制
  keyCtrlDrawing(e) {
    handleKeyEvent(e, {
      // ctrl + z
      z: {
        handler: () => {
          this.root.isNewPoint = false;
          if (this.points.length === 2) {
            this.unmount();
            this.root.offCurDrawLine();
          } else {
            this.points.pop();
            this.mapToView();
          }
        },
        modifier: {
          ctrl: true
        }
      }
    });
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
mixin(BaseLinkLine, PolylineLinkable);
mixin(BaseLinkLine, LineLinkable);

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

function calcCrossIndex(p) {
  const points = this.points;
  let index = 0;
  let curPoint;
  let curDistance = Infinity;
  for (let i = 0; i < points.length - 1; i++) {
    const { distance, point } = calcDistance(points[i], points[i + 1], p);
    if (curDistance > distance) {
      curDistance = distance;
      index = i;
      curPoint = point;
    }
  }
  return { index, point: curPoint };
}

// 计算点到线段的距离
function calcDistance(a, b, p) {
  const vAB = [b[0] - a[0], b[1] - a[1]];
  const vAP = [p[0] - a[0], p[1] - a[1]];
  const vBP = [p[0] - b[0], p[1] - b[1]];
  const dotAB_AP = vAB[0] * vAP[0] + vAB[1] * vAP[1];
  const dotAB_BP = vAB[0] * vBP[0] + vAB[1] * vBP[1];
  if (dotAB_AP <= 0) {
    // AP
    return { distance: d(a, p), point: a };
  } else if (dotAB_BP >= 0) {
    // BP
    return { distance: d(b, p), point: b };
  } else {
    // 点到直线
    if (a[0] === b[0]) {
      // 垂直
      return { distance: (p[0] - a[0]) ** 2, point: [a[0], p[1]] };
    } else if (a[1] === b[1]) {
      // 水平
      return { distance: (p[1] - a[1]) ** 2, point: [p[0], a[1]] };
    } else {
      // 普通倾斜直线
      const k = (b[1] - a[1]) / (b[0] - a[0]);
      // a[1] = k * a[0] + b
      // b = a[1] - k * a[0];
      // k * x - y + b = 0
      return { distance: (k * p[0] - p[1] + a[1] - k * a[0]) ** 2 / (k ** 2 + 1), point: [p[0], p[1]] };
    }
  }

  function d(a, b) {
    // 只需比较大小 不进行开平方操作
    return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2;
  }
}

export { BaseLinkLine };
