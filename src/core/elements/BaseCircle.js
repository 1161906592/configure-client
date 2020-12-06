import { Element } from "../Element";
import { typeEnum } from "../enums";
import { extend, mixin } from "../helpers";
import { Draggable } from "../mixins/Draggable";
import { Container } from "../mixins/Container";
import { Polyline } from "./Polyline";

function BaseCircle(opts) {
  Element.call(this, opts);
  Draggable.call(this, opts);
  Container.call(this, opts);
}

BaseCircle.prototype = {
  constructor: BaseCircle,

  type: typeEnum.circle,

  r: 30,
  borderWidth: 1,

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
    return [
      [this.x, this.y - this.r],
      [this.x + this.r, this.y],
      [this.x, this.y + this.r],
      [this.x - this.r, this.y]
    ];
  },

  followVertex(vertex, offset) {
    Container.prototype.followVertex.call(this, vertex, offset);
    lineFollow.call(this);
  },

  makeDrawingLine(e) {
    return makePolyline.call(this, e);
  },

  makeDrawingLineEndPoint(e) {
    return makePolylineEndPoint.call(this, e);
  },

  updateShape(vertex, offset) {
    [resizeT, resizeR, resizeB, resizeL][vertex.index](this, offset);
    this.update();
  },

  unmount() {
    Element.prototype.unmount.call(this);
    Container.prototype.clearLine.call(this);
  },

  exportStruct() {
    return {
      ...Element.prototype.exportStruct.call(this),
      r: this.r,
      image: this.image,
      lines: Container.prototype.exportStruct.call(this)
    };
  }
};

extend(BaseCircle, Element);
mixin(BaseCircle, Draggable);
mixin(BaseCircle, Container);

function makePolyline(e) {
  const b = this.r / Math.sqrt((e.offsetX - this.x) ** 2 + (e.offsetY - this.y) ** 2);

  const line = new Polyline({
    points: [[~~(this.x + (e.offsetX - this.x) * b) + 0.5, ~~(this.y + (e.offsetY - this.y) * b) + 0.5]]
  });

  this.lines.push({
    id: line.id,
    isStart: true,
    isBottom: e.offsetY > this.y,
    isRight: e.offsetX > this.x,
    line: line
  });

  return line;
}

function makePolylineEndPoint(last2) {
  const root = this.root;
  const line = root.curDrawLine;
  let sin;
  let cos;
  let arrowDirection;
  if (root.isCurLineVertical) {
    arrowDirection = "B";
    if (last2[1] > this.y) {
      arrowDirection = "T";
    }
    cos = (last2[0] - this.x) / this.r;
    sin = Math.sqrt(1 - cos ** 2);
    if (last2[1] < this.y) {
      sin = -sin;
    }
  } else {
    arrowDirection = "R";
    if (last2[0] > this.x) {
      arrowDirection = "L";
    }
    sin = (last2[1] - this.y) / this.r;
    cos = Math.sqrt(1 - sin ** 2);
    if (last2[0] < this.x) {
      cos = -cos;
    }
  }
  this.lines.push({
    id: line.id,
    isStart: false,
    sin: sin,
    cos: cos,
    line: line
  });
  line.direction = arrowDirection;

  let point;
  if (this.root.isCurLineVertical) {
    const offsetY = Math.sqrt(this.r ** 2 - (this.x - last2[0]) ** 2);
    point = [last2[0], this.y - offsetY];
    if (last2[1] > this.y) {
      point[1] = this.y + offsetY;
    }
  } else {
    const offsetX = Math.sqrt(this.r ** 2 - (this.y - last2[1]) ** 2);
    point = [this.x - offsetX, last2[1]];
    if (last2[0] > this.x) {
      point[0] = this.x + offsetX;
    }
  }

  return point;
}

function resizeT(circle, offset) {
  circle.y += offset.y / 2;
  circle.r -= offset.y / 2;
}

function resizeR(circle, offset) {
  circle.x += offset.x / 2;
  circle.r += offset.x / 2;
}

function resizeB(circle, offset) {
  circle.y += offset.y / 2;
  circle.r += offset.y / 2;
}

function resizeL(circle, offset) {
  circle.x += offset.x / 2;
  circle.r -= offset.x / 2;
}

function lineFollow() {
  this.lines.forEach(item => {
    const line = item.line;
    line.isFollowStart = item.isStart;
    const points = line.points;
    const point = item.isStart ? points[0] : points[points.length - 1];

    const x = ~~(this.x + this.r * item.cos) + 0.5;
    const y = ~~(this.y + this.r * item.sin) + 0.5;
    line.followHost({
      x: x - point[0],
      y: y - point[1]
    });
  });
}

export { BaseCircle };
