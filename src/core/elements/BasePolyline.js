import { typeEnum } from "../enums";
import { extend, handleKeyEvent, lastItem, mixin } from "../helpers";
import { BaseLinkLine, updatePoint } from "./BaseLinkLine";
import { PolylineLinkable } from "@/core/mixins/PolylineLinkable";

function BasePolyline(opts) {
  BaseLinkLine.call(this, opts);
  PolylineLinkable.call(this, opts);
}

BasePolyline.prototype = {
  constructor: BasePolyline,

  type: typeEnum.polyline,

  points: [
    [0, 0],
    [0, 0]
  ],

  color: "#000",

  useArrow: false,

  focusIndex: -1, // 动态属性
  focusPoint: null, // 触发获取焦点的坐标

  update() {
    nextVertexFollow.call(this);
    BaseLinkLine.prototype.update.call(this);
  },

  makeDirectionPoints() {
    const points = this.points;
    return [lastItem(points, 2), lastItem(points)];
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

  onfocus(p) {
    focusPoint.call(this, p);
  },

  // 失去焦点时的逻辑处理
  onblur() {
    BaseLinkLine.prototype.onblur.call(this);
    // 重置 focusIndex
    this.focusIndex = -1;
    this.focusPoint = null;
    // 合并拐点
    mergeBreakPoints(this.points);
    // 合并拐点不会产生副作用，只需要重新映射一次视图
    this.mapToView();
  },

  updateByKeydown(e) {
    updateByKeydown.call(this, e);
    BaseLinkLine.prototype.updateByKeydown.call(this, e);
  },

  updateShapeByVertex(vertex) {
    this.focusIndex = vertex.index;
    // 通过顶点更新 focusIndex 时需要重置 focusPoint
    this.focusPoint = null;
    BaseLinkLine.prototype.updateShapeByVertex.call(this, vertex);
  },

  updatePoint(index, point) {
    if (this.points.length === 2) {
      // 自动增加拐点
      breakSection.call(this, 0);
      if (index === 1) {
        index += 2;
      }
    }
    const focusIndex = this.focusIndex;
    const points = this.points;
    let isLeftVertical = points[focusIndex][0] === points[focusIndex - 1]?.[0];
    let isRightVertical = points[focusIndex][0] === points[focusIndex + 1]?.[0];
    // 重合时
    if (isLeftVertical && isRightVertical) {
      if (isLeftVertical && points[focusIndex][1] === points[focusIndex - 1]?.[1]) {
        isLeftVertical = false;
      }
      if (isRightVertical && points[focusIndex][1] === points[focusIndex + 1]?.[1]) {
        isRightVertical = false;
      }
    }
    this.isRightVertical = isRightVertical;
    this.isLeftVertical = isLeftVertical;
    BaseLinkLine.prototype.updatePoint.call(this, index, point);
  },

  ondragstart([x, y]) {
    const curPoint = this.points[this.focusIndex];
    this.dragOffsetX = x - curPoint[0];
    this.dragOffsetY = y - curPoint[1];
  },

  ondrag({ x, y }) {
    updateSection.call(this, { x, y });
  }
};

extend(BasePolyline, BaseLinkLine);
mixin(BasePolyline, PolylineLinkable);

// 与改变的点相连的点跟随
function nextVertexFollow() {
  const focusIndex = this.focusIndex;
  if (focusIndex === -1) return;
  const points = this.points;
  if (focusIndex === 0) {
    const point = points[1];
    const first = points[0];
    if (this.isRightVertical) {
      point[0] = first[0];
    } else {
      point[1] = first[1];
    }
  } else if (focusIndex === points.length - 1) {
    const last = lastItem(points);
    const last2 = lastItem(points, 2);
    if (this.isLeftVertical) {
      last2[0] = last[0];
    } else {
      last2[1] = last[1];
    }
  } else {
    if (focusIndex === 1) {
      if (this.isLeftVertical) {
        updatePoint.call(this, 0, [points[1][0], points[0][1]]);
        points[1][0] = points[0][0];
      } else {
        updatePoint.call(this, 0, [points[0][0], points[1][1]]);
        points[1][1] = points[0][1];
      }
    } else {
      if (this.isLeftVertical) {
        points[focusIndex - 1][0] = points[focusIndex][0];
      } else {
        points[focusIndex - 1][1] = points[focusIndex][1];
      }
    }
    if (focusIndex === points.length - 2) {
      if (this.isRightVertical) {
        updatePoint.call(this, points.length - 1, [points[points.length - 2][0], points[points.length - 1][1]]);
        points[points.length - 2][0] = points[points.length - 1][0];
      } else {
        updatePoint.call(this, points.length - 1, [points[points.length - 1][0], points[points.length - 2][1]]);
        points[points.length - 2][1] = points[points.length - 1][1];
      }
    } else {
      if (this.isRightVertical) {
        points[focusIndex + 1][0] = points[focusIndex][0];
      } else {
        points[focusIndex + 1][1] = points[focusIndex][1];
      }
    }
  }
}

// 折断线段的某一小段
function breakSection(index) {
  const points = this.points;
  const curIndex = index === points.length - 1 ? index - 1 : index;
  if (isSectionVertical(points, curIndex)) {
    const halfY = (points[curIndex][1] + points[curIndex + 1][1]) / 2;
    insertPoints.call(this, curIndex + 1, [points[curIndex][0], halfY], [points[curIndex][0], halfY]);
  } else {
    const halfX = (points[curIndex][0] + points[curIndex + 1][0]) / 2;
    insertPoints.call(this, curIndex + 1, [halfX, points[curIndex][1]], [halfX, points[curIndex][1]]);
  }
  // 如果有focusPoint, 根据focusPoint调整 focusIndex 的值
  this.focusPoint && focusPoint.call(this, this.focusPoint);
}

// 插入点
function insertPoints(index, ...points) {
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
      // 普通倾斜直线 暂不实现
      // y - (y2 - y1) * (x - x1) / (x2 - x1) - y1 = 0
      // y - ( (y2 - y1) * x / (x2 - x1) - (y2 - y1) * x1 / (x2 - x1) ) - y1 = 0
      // y - (y2 - y1) * x / (x2 - x1) + (y2 - y1) * x1 / (x2 - x1) - y1 = 0
    }
  }

  function d(a, b) {
    // 只需比较大小 不进行开平方操作
    return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2;
  }
}

function focusPoint(p) {
  const { index } = calcCrossIndex.call(this, p);
  this.focusIndex = index;
  this.focusPoint = p;
}

function updateSection({ x, y }) {
  const leftPoint = this.points[this.focusIndex];
  // 判断是垂直还是水平
  if (isSectionVertical(this.points, this.focusIndex)) {
    this.updatePoint(this.focusIndex, [x, leftPoint[1]]);
  } else {
    this.updatePoint(this.focusIndex, [leftPoint[0], y]);
  }
}

function updateByKeydown(e) {
  const { focusIndex, points } = this;
  let [x, y] = points[focusIndex];
  const isVertical = isSectionVertical(points, focusIndex);
  handleKeyEvent(e, {
    ArrowUp: () => {
      if (isVertical) return;
      y--;
      this.updatePoint(focusIndex, [x, y]);
    },
    ArrowRight: () => {
      if (!isVertical) return;
      x++;
      this.updatePoint(focusIndex, [x, y]);
    },
    ArrowDown: () => {
      if (isVertical) return;
      y++;
      this.updatePoint(focusIndex, [x, y]);
    },
    ArrowLeft: () => {
      if (!isVertical) return;
      x--;
      this.updatePoint(focusIndex, [x, y]);
    },
    b: {
      handler: () => {
        breakSection.call(this, focusIndex);
      },
      modifiers: {
        ctrl: true
      }
    }
  });
}

// 判断其中一段的方向
function isSectionVertical(points, index) {
  if (index === points.length - 1) {
    index--;
  }
  const leftPoint = points[index];
  const rightPoint = points[index + 1];
  return leftPoint[0] === rightPoint[0];
}

function mergeBreakPoints(points) {
  let curIndex = 1;
  let equalsCountX = 0;
  let equalsCountY = 0;
  let x = points[0][0];
  let y = points[0][1];
  while (curIndex < points.length) {
    // 1px 之内的偏差忽略
    if (Math.abs(points[curIndex][0] - x) < 1) {
      // 合并 1px 之内的偏差忽略
      points[curIndex][0] = x;
      equalsCountX++;
    } else {
      x = points[curIndex][0];
      equalsCountX = 0;
    }
    if (Math.abs(points[curIndex][1] - y) < 1) {
      points[curIndex][1] = y;
      equalsCountY++;
    } else {
      y = points[curIndex][1];
      equalsCountY = 0;
    }
    if (equalsCountX === 3 || equalsCountY === 3) {
      points.splice(curIndex - 2, 2);
      curIndex -= 2;
      equalsCountX = 0;
      equalsCountY = 0;
      x = points[curIndex][0];
      y = points[curIndex][1];
    } else {
      curIndex++;
    }
  }
}

export { BasePolyline };
