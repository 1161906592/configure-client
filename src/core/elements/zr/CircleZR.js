import { platformEnum } from "../../Event";
import { Circle as ZRCircle } from "zrender";
import { extend } from "../../helpers";
import { BaseCircle } from "../BaseCircle";

export function CircleZR(opts) {
  opts.platform = platformEnum.zr;
  BaseCircle.call(this, opts);
  this.style = {
    lineWidth: 1,
    stroke: "#000",
    text: "",
    fontSize: 16,
    textFill: "#999",
    fill: "rgba(0, 0, 0, 0)",
    ...this.style
  };
}

CircleZR.prototype = {
  constructor: CircleZR,

  render() {
    this.el = new ZRCircle({
      shape: {
        cx: this.shape.x,
        cy: this.shape.y,
        r: this.shape.r
      },
      style: this.style
    });
  },

  setShape(shape) {
    BaseCircle.prototype.setShape.call(this, shape);
    this.el.setShape({
      cx: this.shape.x,
      cy: this.shape.y,
      r: this.shape.r
    });
  }
};

extend(CircleZR, BaseCircle);
