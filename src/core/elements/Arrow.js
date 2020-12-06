import { Element } from "../Element";
import { typeEnum } from "../enums";
import { extend, lastItem } from "../helpers";
import { platformEnum } from "../enums";
import { Isogon } from "zrender";

function Arrow(opts) {
  Element.call(this, opts);
}

Arrow.prototype = {
  constructor: Arrow,

  type: typeEnum.arrow,

  platform: platformEnum.zr,

  r: 6,

  fill: "#000",

  rotation: Math.PI / 2,

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
      rotation: this.rotation,
      origin: [x, y]
    });
  },

  update() {
    fixArrowCenter(this);
    this.el.attr("origin", [this.x, this.y]);
    this.el.setShape({
      x: this.x,
      y: this.y
    });
  },

  follow() {
    const last = lastItem(this.line.points);
    this.x = last[0];
    this.y = last[1];
    this.update();
  },

  exportStruct() {}
};

extend(Arrow, Element);

function fixArrowCenter(arrow) {
  let { rotation, r } = arrow;
  arrow.x += r * Math.sin(rotation);
  arrow.y += r * Math.cos(rotation);
}

export { Arrow };
