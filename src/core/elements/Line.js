import { Element, typeEnum } from "../Element";
import { Polyline } from "zrender";
import { platformEnum } from "../platform";
import { extend, lastItem } from "../helpers";

function Line(opts) {
  Element.call(this, opts);
}
Line.prototype = {
  type: typeEnum.line,

  platform: platformEnum.zr,

  points: [[0, 0]],

  constructor: Line,

  create() {
    this.el = new Polyline({
      shape: {
        points: this.points
      },
      style: {
        lineWidth: 1,
        stroke: "#000",
        text: "",
        fontSize: 16,
        textFill: "#999"
      }
    });
  },

  unmount(root) {
    Element.prototype.unmount.call(this, root);
    this.startRect.removeLine(this);
    this.endRect.removeLine(this);
  },

  dirty() {
    this.el.setShape({
      shape: {
        points: this.points
      }
    });
  },

  follow(offset) {
    console.log(offset);
  },

  followHost(offset) {
    const points = this.points;

    vertexFollow.call(this, offset);

    if (points.length > 2) {
      nextVertexFollow.call(this);
    } else {
      lineAutoBreak.call(this);
    }

    this.dirty();
  },

  exportStruct() {
    return {
      ...Element.prototype.exportStruct.call(this),
      points: this.points,
      isStartVertical: this.isStartVertical,
      isEndVertical: this.isEndVertical
    };
  }
};

extend(Line, Element);

// 线顶点跟随拖动
function vertexFollow(offset) {
  if (this.isFollowStart) {
    const first = this.points[0];
    first[0] += offset.x;
    first[1] += offset.y;
  } else {
    const last = lastItem(this.points);
    last[0] += offset.x;
    last[1] += offset.y;
  }
}

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
    const point = points[points.length - 2];
    const last = points[points.length - 1];
    if (this.isEndVertical) {
      point[0] = last[0];
    } else {
      point[1] = last[1];
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

export { Line };
