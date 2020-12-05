import { BaseRect } from "../BaseRect";
import { platformEnum } from "../../platform";
import { Rect as ZRRect, Image as ZRImage } from "zrender";
import { extend } from "../../helpers";

function RectZR(opts) {
  BaseRect.call(this, opts);
}

RectZR.prototype = {
  constructor: RectZR,

  platform: platformEnum.zr,

  create() {
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

  toggleImage() {
    this.root.remove(this);
    this.create();
    this.root.add(this);
  }
};

extend(RectZR, BaseRect);

export { RectZR };
