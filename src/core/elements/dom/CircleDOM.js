import { platformEnum } from "../../Event";
import { BaseCircle } from "../BaseCircle";
import { extend } from "../../helpers";

export function CircleDOM(opts) {
  opts.platform = platformEnum.dom;
  BaseCircle.call(this, opts);
  this.style = {
    position: "absolute",
    left: "0px",
    top: "0px",
    "box-sizing": "border-box",
    "border-radius": "50%",
    cursor: "pointer",
    border: "1px solid #000",
    ...this.style
  };
}

CircleDOM.prototype = {
  constructor: CircleDOM,

  render() {
    const div = document.createElement("div");
    const shape = this.shape;
    const style = this.style;
    div.style.cssText =
      `transform: translate3d(${shape.x - shape.r}px, ${shape.y - shape.r}px, 0);width: ${shape.r * 2}px;height: ${shape.r * 2}px;` +
      Object.keys(style)
        .map(key => {
          return key + ":" + style[key] + ";";
        })
        .join("");
    this.el = div;
  },

  setShape(shape) {
    BaseCircle.prototype.setShape.call(this, shape);
    this.el.style.transform = `translate3d(${this.shape.x - this.shape.r}px, ${this.shape.y - this.shape.r}px, 0)`;
  }
};

extend(CircleDOM, BaseCircle);
