import { typeEnum } from "../../enums";
import { Polyline as ZRPolyline } from "zrender";
import { platformEnum } from "../../enums";
import { extend, fixZrCoordinate, lastItem } from "../../helpers";
import { BaseLinkLine } from "../BaseLinkLine";

function Polyline(opts) {
  BaseLinkLine.call(this, opts);
}

Polyline.prototype = {
  constructor: Polyline,

  type: typeEnum.polyline,

  platform: platformEnum.zr,

  points: [[0, 0]],

  useArrow: false,

  create() {
    BaseLinkLine.prototype.create.call(this);
    this.el = new ZRPolyline({
      shape: {
        points: fixCoordinate(this.points)
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

  makeDirectionPoints() {
    const points = this.points;
    return [lastItem(points, 2), lastItem(points)];
  },

  mapToView() {
    this.el.setShape({
      points: fixCoordinate(this.points)
    });
  },

  syncBreakPoints() {
    if (this.points.length > 2) {
      nextVertexFollow.call(this);
    } else {
      lineAutoBreak.call(this);
    }
  },

  export() {
    return {
      ...BaseLinkLine.prototype.export.call(this),
      isStartVertical: this.isStartVertical,
      isEndVertical: this.isEndVertical
    };
  }
};

extend(Polyline, BaseLinkLine);

function fixCoordinate(points) {
  return points.map(([x, y]) => {
    return [fixZrCoordinate(x), fixZrCoordinate(y)];
  });
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

export { Polyline };
