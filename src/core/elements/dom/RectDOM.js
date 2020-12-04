import { BaseRect } from "../BaseRect";
import { platformEnum } from "../../Event";
import { eachObj, extend } from "../../helpers";
import { VertexDOM } from "./VertexDOM";

export function RectDOM(opts) {
  BaseRect.call(this, opts);
  this.platform = platformEnum.dom;
  this.style = {
    position: "absolute",
    left: "0px",
    top: "0px",
    "box-sizing": "border-box",
    border: "1px solid #000",
    ...this.style
  };
}

RectDOM.prototype = {
  render() {
    const div = document.createElement("div");
    const shape = this.shape;
    const style = this.style;
    eachObj(style, (value, key) => {
      div.style[key] = value;
    });
    div.style.transform = `translate3d(${shape.x}px, ${shape.y}px, 0)`;
    div.style.width = `${shape.width}px`;
    div.style.height = `${shape.height}px`;
    div.style.background = `url(${this.image}) center/100% 100%`;
    this.el = div;
  },

  setShape(shape) {
    BaseRect.prototype.setShape.call(this, shape);
    this.el.style.transform = `translate3d(${this.shape.x + (this.shape.width < 0 ? this.shape.width : 0)}px, ${this.shape.y +
      (this.shape.height < 0 ? this.shape.height : 0)}px, 0)`;
    this.el.style.width = `${Math.abs(this.shape.width)}px`;
    this.el.style.height = `${Math.abs(this.shape.height)}px`;
  },

  makeVertex(opts) {
    return new VertexDOM(opts);
  },

  setImage(image) {
    BaseRect.prototype.setImage.call(this, image);
    this.el.style.background = `url(${this.image}) center/100% 100%`;
  }
};

extend(RectDOM, BaseRect);
