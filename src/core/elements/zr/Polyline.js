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
  }
};

extend(Polyline, BaseLinkLine);

function fixCoordinate(points) {
  return points.map(([x, y]) => {
    return [fixZrCoordinate(x), fixZrCoordinate(y)];
  });
}

export { Polyline };
