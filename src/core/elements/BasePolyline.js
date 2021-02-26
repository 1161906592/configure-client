import { typeEnum } from "../enums";
import { extend, lastItem, mixin } from "../helpers";
import { BaseLinkLine } from "./BaseLinkLine";
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

  create() {
    BaseLinkLine.prototype.create.call(this);
  },

  makeDirectionPoints() {
    const points = this.points;
    return [lastItem(points, 2), lastItem(points)];
  },

  syncBreakPoints() {
    if (this.points.length > 2) {
      nextVertexFollow.call(this);
    } else {
      lineAutoBreak.call(this);
    }
  },

  makeLineStartPoint() {
    return { point: this.points[0], sin: this.startSin, cos: this.startCos };
  },

  // 获取
  makeBeforeBreakPoints(p) {
    const { index, point } = calcCrossIndex.call(this, p);
    return [...this.points.slice(1, index + 1), point];
  },

  makeLineEndPoint() {
    return { point: lastItem(this.points), sin: this.endSin, cos: this.endCos };
  },

  makeAfterBreakPoints(p) {
    const { index, point } = calcCrossIndex.call(this, p);
    return [point, ...this.points.slice(index + 1)];
  },

  export() {
    return {
      ...BaseLinkLine.prototype.export.call(this),
      isStartVertical: this.isStartVertical,
      isEndVertical: this.isEndVertical
    };
  }
};

extend(BasePolyline, BaseLinkLine);
mixin(BasePolyline, PolylineLinkable);

// 与端点相连的点跟随
function nextVertexFollow() {
  const points = this.points;
  if (this.isFollowStart) {
    const point = points[1];
    const first = points[0];
    if (this.isStartVertical) {
      point[0] = first[0];
    } else {
      point[1] = first[1];
    }
  } else {
    const last = lastItem(points);
    const last2 = lastItem(points, 2);
    if (this.isEndVertical) {
      last2[0] = last[0];
    } else {
      last2[1] = last[1];
    }
  }
}

// 线自动转折
function lineAutoBreak() {
  const points = this.points;

  if (this.isStartVertical || this.isEndVertical) {
    if (points[0][0] !== points[1][0]) {
      let halfY = (points[1][1] - points[0][1]) / 2;
      points.splice(1, 0, [points[0][0], ~~(points[0][1] + halfY) + 0.5], [points[1][0], ~~(points[0][1] + halfY) + 0.5]);
    }
  } else {
    if (points[0][1] !== points[1][1]) {
      let halfX = ~~((points[1][0] - points[0][0]) / 2);
      points.splice(1, 0, [~~(points[0][0] + halfX) + 0.5, points[0][1]], [~~(points[0][0] + halfX) + 0.5, points[1][1]]);
    }
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
  if (dotAB_AP < 0) {
    // AP
    return { distance: d(a, p), point: a };
  } else if (dotAB_BP > 0) {
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

export { BasePolyline };
