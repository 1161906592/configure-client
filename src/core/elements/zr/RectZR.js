import { BaseRect } from "../BaseRect";
import { platformEnum } from "../../enums";
import { Rect as ZRRect, Image as ZRImage } from "zrender";
import { extend } from "../../helpers";

function RectZR(opts) {
  BaseRect.call(this, opts);
  this.typeHandlerMap = new Map();
}

RectZR.prototype = {
  constructor: RectZR,

  platform: platformEnum.zr,

  create() {
    let x = ~~this.x + 0.5;
    let y = ~~this.y + 0.5;
    let width = this.width - 1;
    let height = this.height - 1;
    if (this.image) {
      x--;
      y--;
      width++;
      height++;
    }
    this.el = this.image
      ? new ZRImage({
          style: {
            x: x,
            y: y,
            width: width,
            height: height,
            image: this.image
          }
        })
      : new ZRRect({
          shape: {
            x: x,
            y: y,
            width: width,
            height: height
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

  update() {
    BaseRect.prototype.update.call(this);
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

  on(type, handler) {
    BaseRect.prototype.on.call(this, type, handler);
    // 记录当前元素添加过的事件 用于图片切换之后把事件重新添加到新的元素上
    if (!this.typeHandlerMap.get(type)) {
      this.typeHandlerMap.set(type, []);
    }
    this.typeHandlerMap.get(type).push(handler);
  },

  off(type, handler) {
    BaseRect.prototype.off.call(this, type, handler);
    const handlers = this.typeHandlerMap.get(type);
    if (!handlers || !handlers.length) return;
    const idx = handlers?.findIndex(d => d === handler);
    if (idx !== -1) {
      handlers.splice(idx, 1);
    }
  },

  toggleImage() {
    this.root.painter.zrRoot.remove(this.el);
    this.typeHandlerMap.forEach((handlers, type) => {
      handlers.forEach(handler => {
        BaseRect.prototype.off.call(this, type, handler);
      });
    });
    this.create();
    this.root.painter.zrRoot.add(this.el);
    this.typeHandlerMap.forEach((handlers, type) => {
      handlers.forEach(handler => {
        BaseRect.prototype.on.call(this, type, handler);
      });
    });
  }
};

extend(RectZR, BaseRect);

export { RectZR };
