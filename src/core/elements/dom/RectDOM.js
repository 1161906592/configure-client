import { BaseRect } from "../BaseRect";
import { platformEnum } from "../../Event";
import { eachObj, extend } from "../../helpers";
import { VertexDOM } from "./VertexDOM";

export function RectDOM(opts) {
  BaseRect.call(this, opts);
  this.platform = platformEnum.dom;
}

RectDOM.prototype = {
  render() {
    const div = document.createElement("div");
    eachObj(
      {
        position: "absolute",
        left: "0px",
        top: "0px",
        "box-sizing": "border-box",
        border: "1px solid #000"
      },
      (value, key) => {
        div.style[key] = value;
      }
    );
    div.style.transform = `translate3d(${this.x}px, ${this.y}px, 0)`;
    div.style.width = `${this.width}px`;
    div.style.height = `${this.height}px`;
    div.style.background = `url(${this.image}) center/100% 100%`;
    this.el = div;
  },

  dirty() {
    this.el.style.transform = `translate3d(${this.x + (this.width < 0 ? this.width : 0)}px, ${this.y + (this.height < 0 ? this.height : 0)}px, 0)`;
    this.el.style.width = `${Math.abs(this.width)}px`;
    this.el.style.height = `${Math.abs(this.height)}px`;
    this.el.style.background = `url(${this.image}) center/100% 100%`;
  },

  makeVertex(opts) {
    return new VertexDOM(opts);
  }
};

extend(RectDOM, BaseRect);
