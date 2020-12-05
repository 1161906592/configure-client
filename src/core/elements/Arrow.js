import { Element } from "../Element";
import { typeEnum } from "../enums";
import { extend, makeMap } from "../helpers";
import { platformEnum } from "../enums";
import { Isogon } from "zrender";

export const arrowDirectionEnum = {
  T: "T",
  R: "R",
  B: "B",
  L: "L"
};

const directionRotateMap = makeMap(
  [
    { direction: arrowDirectionEnum.T, rotate: 0 },
    { direction: arrowDirectionEnum.R, rotate: Math.PI * -0.5 },
    { direction: arrowDirectionEnum.B, rotate: Math.PI },
    { direction: arrowDirectionEnum.L, rotate: Math.PI * 0.5 }
  ],
  (map, item) => {
    map[item.direction] = item.rotate;
  }
);

function Arrow(opts) {
  Element.call(this, opts);
}

Arrow.prototype = {
  constructor: Arrow,

  type: typeEnum.arrow,

  platform: platformEnum.zr,

  r: 6,

  fill: "#000",

  direction: arrowDirectionEnum.B,

  create() {
    fixArrowCenter(this);
    const { x, y } = this;
    this.el = new Isogon({
      shape: {
        x: x,
        y: y,
        r: this.r,
        n: 3
      },
      style: {
        fill: this.fill,
        stroke: 1
      },
      rotation: directionRotateMap[this.direction],
      origin: [x, y]
    });
  },

  update() {
    this.el.attr("origin", [this.x, this.y]);
    this.el.setShape({
      x: this.x,
      y: this.y
    });
  },

  follow(offset) {
    this.x += offset.x;
    this.y += offset.y;
    this.update();
  },

  exportStruct() {}
};

extend(Arrow, Element);

function fixArrowCenter(arrow) {
  let { x, y, direction } = arrow;
  switch (direction) {
    case arrowDirectionEnum.T:
      y += 6;
      break;
    case arrowDirectionEnum.R:
      x -= 6;
      break;
    case arrowDirectionEnum.B:
      y -= 6;
      break;
    case arrowDirectionEnum.L:
      x += 6;
      break;
  }
  arrow.x = x;
  arrow.y = y;
}

export { Arrow };
