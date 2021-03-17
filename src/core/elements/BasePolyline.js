import { typeEnum } from "../enums";
import { extend, handleKeyEvent, lastItem } from "../helpers";
import { BaseLinkLine, updatePoint } from "./BaseLinkLine";

function BasePolyline(opts) {
  BaseLinkLine.call(this, opts);
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
  curFocusPoint: null, // 触发获取焦点的坐标

  update() {
    nextVertexFollow.call(this);
    BaseLinkLine.prototype.update.call(this);
  },

  makeDirectionPoints() {
    const points = this.points;
    return [lastItem(points, 2), lastItem(points)];
  },

  // 失去焦点时的逻辑处理
  onblur() {
    BaseLinkLine.prototype.onblur.call(this);
    // 重置 focusIndex
    this.focusIndex = -1;
    this.curFocusPoint = null;
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
    this.curFocusPoint = null;
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
    this.insertPoints(curIndex + 1, [points[curIndex][0], halfY], [points[curIndex][0], halfY]);
  } else {
    const halfX = (points[curIndex][0] + points[curIndex + 1][0]) / 2;
    this.insertPoints(curIndex + 1, [halfX, points[curIndex][1]], [halfX, points[curIndex][1]]);
  }
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
        // 如果有focusPoint, 根据focusPoint调整 focusIndex 的值
        this.focusPoint(this.curFocusPoint);
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
