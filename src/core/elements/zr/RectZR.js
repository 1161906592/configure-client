import { BaseRect } from "../BaseRect";
import { platformEnum } from "../../Event";
import { Rect as ZRRect, Image as ZRImage } from "zrender";
import { VertexZR } from "./VertexZR";
import { extend } from "../../helpers";

export function RectZR(opts) {
  BaseRect.call(this, opts);
  this.platform = platformEnum.zr;
  this.style = {
    lineWidth: 1,
    stroke: "#000",
    text: "",
    fontSize: 16,
    textFill: "#999",
    fill: "rgba(0,0,0,0)",
    ...this.style
  };
}

RectZR.prototype = {
  constructor: RectZR,

  render() {
    this.shape.x = ~~this.shape.x + 0.5;
    this.shape.y = ~~this.shape.y + 0.5;
    this.el = this.image
      ? new ZRImage({
          style: {
            ...this.shape,
            image: this.image
          }
        })
      : new ZRRect({
          shape: this.shape,
          style: this.style
        });
  },

  setShape(shape) {
    BaseRect.prototype.setShape.call(this, shape);
    this.image ? this.el.setStyle(this.shape) : this.el.setShape(this.shape);
  },

  makeVertex(opts) {
    return new VertexZR(opts);
  },

  setImage(image) {
    BaseRect.prototype.setImage.call(this, image);
    this.root.remove(this);
    this.render();
    this.root.add(this);
  }
};

extend(RectZR, BaseRect);
