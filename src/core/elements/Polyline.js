import { Element } from "../Element";
import { typeEnum } from "../enums";
import { Polyline as ZRPolyline } from "zrender";
import { platformEnum } from "../enums";
import { extend, lastItem } from "../helpers";
import { createElement } from "../createElement";

function Polyline(opts) {
  Element.call(this, opts);
}
Polyline.prototype = {
  constructor: Polyline,

  type: typeEnum.line,

  platform: platformEnum.zr,

  points: [[0, 0]],

  useArrow: false,

  create() {
    this.el = new ZRPolyline({
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
    this.useArrow && this.addArrow();
  },

  mount(root) {
    Element.prototype.mount.call(this, root);
    this.arrow && this.root.add(this.arrow);
  },

  unmount(root) {
    Element.prototype.unmount.call(this, root);
    this.startElement.removeLine(this);
    this.endElement.removeLine(this);
    this.removeArrow();
  },

  update() {
    this.el.setShape({
      shape: {
        points: this.points
      }
    });
    this.useArrow ? this.addArrow() : this.removeArrow();
  },

  followHost(newPoint) {
    const points = this.points;
    points[this.isFollowStart ? 0 : points.length - 1] = newPoint;

    if (points.length > 2) {
      nextVertexFollow.call(this);
    } else {
      lineAutoBreak.call(this);
    }

    this.arrow && this.arrow.follow();

    this.update();
  },

  exportStruct() {
    return {
      ...Element.prototype.exportStruct.call(this),
      points: this.points,
      isStartVertical: this.isStartVertical,
      isEndVertical: this.isEndVertical,
      useArrow: this.useArrow
    };
  },

  addArrow() {
    if (this.arrow) return;
    const last = lastItem(this.points);
    const last2 = lastItem(this.points, 2);
    this.arrow = createElement({
      type: typeEnum.arrow,
      platform: platformEnum.zr,
      x: last[0],
      y: last[1],
      rotation: calcRotation(last2, last),
      line: this
    });
    this.isMounted && this.root.add(this.arrow);
  },

  removeArrow() {
    if (!this.arrow || !this.arrow.isMounted) return;
    this.root.remove(this.arrow);
  }
};

extend(Polyline, Element);

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

function calcRotation(p1, p2) {
  return Math.atan2(p1[1] - p2[1], p2[0] - p1[0]) - Math.PI / 2;
}

export { Polyline };
