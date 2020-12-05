import { Element, typeEnum } from "../Element";
import { extend, mixin } from "../helpers";
import { DrawLine } from "../mixins/DrawLine";
import { Resize } from "../mixins/Resize";

function BaseRect(opts) {
  Element.call(this, opts);
  DrawLine.call(this, opts);
  Resize.call(this, opts);
}

BaseRect.prototype = {
  constructor: BaseRect,

  type: typeEnum.rect,

  width: 200,

  height: 100,

  r: 4,

  follow(offset) {
    Element.prototype.follow.call(this, offset);
    Resize.prototype.follow.call(this, offset);
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
    Resize.prototype.followVertex.call(this, vertex, offset);
    [lineFollowRectLT, lineFollowRectT, lineFollowRectRT, lineFollowRectR, lineFollowRectRB, lineFollowRectB, lineFollowRectLB, lineFollowRectL][
      vertex.index
    ].call(this, offset);
  },

  updateShape(vertex, offset) {
    [resizeRectLT, resizeRectT, resizeRectRT, resizeRectR, resizeRectRB, resizeRectB, resizeRectLB, resizeRectL][vertex.index].call(this, offset);
    this.dirty();
  },

  unmount() {
    Element.prototype.unmount.call(this);
    DrawLine.prototype.clearLine.call(this);
  },

  exportStruct() {
    return {
      ...Element.prototype.exportStruct.call(this),
      width: this.width,
      height: this.height,
      r: this.r,
      image: this.image,
      lines: DrawLine.prototype.exportStruct.call(this)
    };
  }
};

extend(BaseRect, Element);
mixin(BaseRect, DrawLine);
mixin(BaseRect, Resize);

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
