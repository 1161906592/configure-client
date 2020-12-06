import { BaseRect } from "../BaseRect";
import { platformEnum } from "../../enums";
import { Rect as ZRRect, Image as ZRImage } from "zrender";
import { extend, mixin } from "../../helpers";
import { ToggleZRImage } from "../../mixins/ToggleZRImage";

function RectZR(opts) {
  BaseRect.call(this, opts);
  ToggleZRImage.call(this, opts);
}

RectZR.prototype = {
  constructor: RectZR,

  platform: platformEnum.zr,

  create() {
    const shape = makeRectShape(this);
    this.el = this.image
      ? new ZRImage({
          style: {
            ...shape,
            image: this.image
          }
        })
      : new ZRRect({
          shape: shape,
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

  update() {
    BaseRect.prototype.update.call(this);
    if (this.hasImage !== !!this.image) {
      this.toggleImage();
      return;
    }
    const shape = makeRectShape(this);
    this.image
      ? this.el.setStyle({
          ...shape,
          image: this.image
        })
      : this.el.setShape(shape);
  },

  on(type, handler) {
    BaseRect.prototype.on.call(this, type, handler);
    ToggleZRImage.prototype.on.call(this, type, handler);
  },

  off(type, handler) {
    BaseRect.prototype.off.call(this, type, handler);
    ToggleZRImage.prototype.off.call(this, type, handler);
  }
};

function makeRectShape(rect) {
  let x = ~~rect.x + 0.5;
  let y = ~~rect.y + 0.5;
  let width = rect.width - 1;
  let height = rect.height - 1;
  if (rect.image) {
    x--;
    y--;
    width++;
    height++;
  }
  return {
    x,
    y,
    width,
    height
  };
}

extend(RectZR, BaseRect);
mixin(RectZR, ToggleZRImage);

export { RectZR };
