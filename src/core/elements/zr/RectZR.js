import { BaseRect } from "../BaseRect";
import { platformEnum } from "../../Event";
import { Rect as ZRRect, Image as ZRImage } from "zrender";
import { VertexZR } from "./VertexZR";
import { extend } from "../../helpers";

export function RectZR(opts) {
  BaseRect.call(this, opts);
  this.platform = platformEnum.zr;
}

RectZR.prototype = {
  constructor: RectZR,

  render() {
    const x = ~~this.x + 0.5;
    const y = ~~this.y + 0.5;
    this.el = this.image
      ? new ZRImage({
          style: {
            x: x,
            y: y,
            width: this.width,
            height: this.height,
            image: this.image
          }
        })
      : new ZRRect({
          shape: {
            x: x,
            y: y,
            width: this.width,
            height: this.height
          },
          style: {
            lineWidth: 1,
            stroke: "#000",
            text: "",
            fontSize: 16,
            textFill: "#999",
            fill: "rgba(0,0,0,0)"
          }
        });

    this.hasImage = !!this.image;
  },

  dirty() {
    if (this.hasImage !== !!this.image) {
      this.toggleImage();
      return;
    }
    const x = ~~this.x + 0.5;
    const y = ~~this.y + 0.5;
    const shape = {
      x: x,
      y: y,
      width: this.width,
      height: this.height
    };
    this.image
      ? this.el.setStyle({
          ...shape,
          image: this.image
        })
      : this.el.setShape(shape);
  },

  makeVertex(opts) {
    return new VertexZR(opts);
  },

  toggleImage() {
    this.root.remove(this);
    this.render();
    this.root.add(this);
  }
};

extend(RectZR, BaseRect);
