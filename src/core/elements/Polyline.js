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
    this.startRect.removeLine(this);
    this.endRect.removeLine(this);
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

  followHost(offset) {
    const points = this.points;

    vertexFollow.call(this, offset);

    if (points.length > 2) {
      nextVertexFollow.call(this);
    } else {
      lineAutoBreak.call(this);
    }

    this.update();
  },

  // 直接设置host的形状时
  followHostUpdate(host, relation) {
    this.isFollowStart = relation.isStart;
    const point = relation.isStart ? this.points[0] : lastItem(this.points);
    if (this.isStartVertical || this.isEndVertical) {
      const offsetX = host.x > point[0] ? ~~(host.x - point[0] + 1) : host.x + host.width < point[0] ? ~~(host.x + host.width - point[0]) : 0;
      if (relation.isBottom) {
        this.followHost({ x: offsetX, y: host.y + host.height - point[1] });
      } else {
        this.followHost({ x: offsetX, y: host.y - point[1] });
      }
    } else {
      const offsetY = host.y > point[1] ? ~~(host.y - point[1] + 1) : host.y + host.height < point[1] ? ~~(host.y + host.height - point[1]) : 0;
      if (relation.isRight) {
        this.followHost({ x: host.x + host.width - point[0], y: offsetY });
      } else {
        this.followHost({ x: host.x - point[0], y: offsetY });
      }
    }
  },

  exportStruct() {
    return {
      ...Element.prototype.exportStruct.call(this),
      points: this.points,
      isStartVertical: this.isStartVertical,
      isEndVertical: this.isEndVertical,
      direction: this.direction,
      useArrow: this.useArrow
    };
  },

  addArrow() {
    if (this.arrow) return;
    const last = lastItem(this.points);
    this.arrow = createElement({
      type: typeEnum.arrow,
      platform: platformEnum.zr,
      x: last[0],
      y: last[1],
      direction: this.direction
    });
    this.isMounted && this.root.add(this.arrow);
  },

  removeArrow() {
    if (!this.arrow || !this.arrow.isMounted) return;
    this.root.remove(this.arrow);
  }
};

extend(Polyline, Element);

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

    this.arrow && this.arrow.follow(offset);
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

export { Polyline };
