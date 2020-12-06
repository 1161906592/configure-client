import { Element } from "../Element";
import { typeEnum } from "../enums";
import { extend, mixin } from "../helpers";
import { Draggable } from "../mixins/Draggable";
import { Container } from "../mixins/Container";
import { Polyline } from "./Polyline";

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
    Container.prototype.follow.call(this, offset);
    this.lines.forEach(item => {
      const line = item.line;
      line.isFollowStart = item.isStart;
      line.followHost(offset);
    });
  },

  makeRectVertexes() {
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
  },

  followVertex(vertex, offset) {
    Container.prototype.followVertex.call(this, vertex, offset);
    [lineFollowRectLT, lineFollowRectT, lineFollowRectRT, lineFollowRectR, lineFollowRectRB, lineFollowRectB, lineFollowRectLB, lineFollowRectL][
      vertex.index
    ].call(this, offset);
  },

  makeDrawingLine(e) {
    return makePolyline.call(this, e);
  },

  lineDrawing(e) {
    polylineDrawing.call(this, e);
  },

  makeDrawingLineEndPoint(e) {
    return makePolylineEndPoint.call(this, e);
  },

  updateShape(vertex, offset) {
    [resizeRectLT, resizeRectT, resizeRectRT, resizeRectR, resizeRectRB, resizeRectB, resizeRectLB, resizeRectL][vertex.index].call(this, offset);
    this.update();
  },

  unmount() {
    Element.prototype.unmount.call(this);
    Container.prototype.clearLine.call(this);
  },

  setConfiguration(configuration) {
    const offset = Element.prototype.defaultMerge.call(this, configuration);

    // 因为这里会有宽高的变化所以不能直接调用自身的follow方法
    Element.prototype.follow.call(this, offset);
    Container.prototype.follow.call(this, offset);
    // 带动连接线
    this.lines.forEach(item => {
      item.line.followHostUpdate(this, item);
    });
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

function makePolyline(e) {
  const x = ~~e.offsetX + 0.5;
  const y = ~~e.offsetY + 0.5;
  const near = [
    {
      isRight: false,
      value: x - this.x,
      point: [this.x, y]
    },
    {
      isRight: true,
      value: this.x + this.width - x,
      point: [this.x + this.width, y]
    },
    {
      isBottom: false,
      value: y - this.y,
      point: [x, this.y]
    },
    {
      isBottom: true,
      value: this.y + this.height - y,
      point: [x, this.y + this.height]
    }
  ];
  const min = Math.min(...near.map(d => d.value));
  const nearInfo = near.find(d => d.value === min);

  const line = new Polyline({
    points: [nearInfo.point]
  });

  this.lines.push({
    id: line.id,
    isStart: true,
    isBottom: nearInfo.isBottom,
    isRight: nearInfo.isRight,
    line: line
  });

  return line;
}

function polylineDrawing(e) {
  const root = this.root;
  const curDrawLine = root.curDrawLine;
  if (!curDrawLine) return;
  const points = curDrawLine.points;
  if (root.isNewPoint) {
    root.isNewPoint = false;
    points.push([~~e.offsetX + 0.5, ~~e.offsetY + 0.5]);
  } else {
    const last = points[points.length - 2];
    root.isCurLineVertical = Math.abs(e.offsetY - last[1]) > Math.abs(e.offsetX - last[0]);
    points[points.length - 1] = root.isCurLineVertical ? [last[0], ~~e.offsetY + 0.5] : [~~e.offsetX + 0.5, last[1]];
  }
  curDrawLine.update();
}

function makePolylineEndPoint() {
  const root = this.root;
  const line = root.curDrawLine;
  const points = line.points;
  const last2 = points[points.length - 2];

  let point;
  let isBottom = false;
  let isRight = false;
  let arrowDirection;
  if (root.isCurLineVertical) {
    point = [last2[0], this.y];
    arrowDirection = "B";
    if (last2[1] > this.y) {
      isBottom = true;
      arrowDirection = "T";
      point[1] += this.height;
    }
  } else {
    point = [this.x, last2[1]];
    arrowDirection = "R";
    if (last2[0] > this.x) {
      isRight = true;
      arrowDirection = "L";
      point[0] += this.width;
    }
  }
  this.lines.push({
    id: line.id,
    isStart: false,
    isBottom: isBottom,
    isRight: isRight,
    line: line
  });
  line.direction = arrowDirection;
  line.isStartVertical = points[0][1] !== points[1][1];
  line.isEndVertical = root.isCurLineVertical;

  return point;
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

// 左上
function lineFollowRectLT(offset) {
  this.lines.forEach(item => {
    const line = item.line;
    line.isFollowStart = item.isStart;
    const points = line.points;
    const point = item.isStart ? points[0] : points[points.length - 1];
    if (line.isStartVertical || line.isEndVertical) {
      line.followHost({
        x: point[0] < this.x || point[0] > this.x + this.width ? offset.x : 0,
        y: item.isBottom ? 0 : offset.y
      });
    } else {
      line.followHost({
        x: item.isRight ? 0 : offset.x,
        y: point[1] < this.y || point[1] > this.y + this.height ? offset.y : 0
      });
    }
  });
}

// 上
function lineFollowRectT(offset) {
  this.lines.forEach(item => {
    const line = item.line;
    line.isFollowStart = item.isStart;
    if (line.isStartVertical || line.isEndVertical) {
      line.followHost({
        x: 0,
        y: item.isBottom ? 0 : offset.y
      });
    } else {
      const points = line.points;
      const point = item.isStart ? points[0] : points[points.length - 1];
      line.followHost({
        x: 0,
        y: point[1] < this.y || point[1] > this.y + this.height ? offset.y : 0
      });
    }
  });
}

// 右上
function lineFollowRectRT(offset) {
  this.lines.forEach(item => {
    const line = item.line;
    line.isFollowStart = item.isStart;
    const points = line.points;
    const point = item.isStart ? points[0] : points[points.length - 1];
    if (line.isStartVertical || line.isEndVertical) {
      line.followHost({
        x: point[0] < this.x || point[0] > this.x + this.width ? offset.x : 0,
        y: item.isBottom ? 0 : offset.y
      });
    } else {
      line.followHost({
        x: item.isRight ? offset.x : 0,
        y: point[1] < this.y || point[1] > this.y + this.height ? offset.y : 0
      });
    }
  });
}

// 右
function lineFollowRectR(offset) {
  this.lines.forEach(item => {
    const line = item.line;
    line.isFollowStart = item.isStart;
    if (!line.isStartVertical && !line.isEndVertical) {
      line.followHost({
        x: item.isRight ? offset.x : 0,
        y: 0
      });
    } else {
      const points = line.points;
      const point = item.isStart ? points[0] : points[points.length - 1];
      line.followHost({
        x: point[0] < this.x || point[0] > this.x + this.width ? offset.x : 0,
        y: 0
      });
    }
  });
}

// 右下
function lineFollowRectRB(offset) {
  this.lines.forEach(item => {
    const line = item.line;
    line.isFollowStart = item.isStart;
    const points = line.points;
    const point = item.isStart ? points[0] : points[points.length - 1];
    if (line.isStartVertical || line.isEndVertical) {
      line.followHost({
        x: point[0] < this.x || point[0] > this.x + this.width ? offset.x : 0,
        y: item.isBottom ? offset.y : 0
      });
    } else {
      line.followHost({
        x: item.isRight ? offset.x : 0,
        y: point[1] < this.y || point[1] > this.y + this.height ? offset.y : 0
      });
    }
  });
}

// 下
function lineFollowRectB(offset) {
  this.lines.forEach(item => {
    const line = item.line;
    line.isFollowStart = item.isStart;
    if (line.isStartVertical || line.isEndVertical) {
      line.followHost({
        x: 0,
        y: item.isBottom ? offset.y : 0
      });
    } else {
      const points = line.points;
      const point = item.isStart ? points[0] : points[points.length - 1];
      line.followHost({
        x: 0,
        y: point[1] < this.y || point[1] > this.y + this.height ? offset.y : 0
      });
    }
  });
}

// 左下
function lineFollowRectLB(offset) {
  this.lines.forEach(item => {
    const line = item.line;
    line.isFollowStart = item.isStart;
    const points = line.points;
    const point = item.isStart ? points[0] : points[points.length - 1];
    if (line.isStartVertical || line.isEndVertical) {
      line.followHost({
        x: point[0] < this.x || point[0] > this.x + this.width ? offset.x : 0,
        y: item.isBottom ? offset.y : 0
      });
    } else {
      line.followHost({
        x: item.isRight ? 0 : offset.x,
        y: point[1] < this.y || point[1] > this.y + this.height ? offset.y : 0
      });
    }
  });
}

// 左
function lineFollowRectL(offset) {
  this.lines.forEach(item => {
    const line = item.line;
    line.isFollowStart = item.isStart;
    if (!line.isStartVertical && !line.isEndVertical) {
      line.followHost({
        x: item.isRight ? 0 : offset.x,
        y: 0
      });
    } else {
      const points = line.points;
      const point = item.isStart ? points[0] : points[points.length - 1];
      line.followHost({
        x: point[0] < this.x || point[0] > this.x + this.width ? offset.x : 0,
        y: 0
      });
    }
  });
}

export { BaseRect };
