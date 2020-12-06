import { BaseRect } from "../BaseRect";
import { platformEnum } from "../../enums";
import { extend } from "../../helpers";

function RectDOM(opts) {
  BaseRect.call(this, opts);
}

RectDOM.prototype = {
  constructor: RectDOM,

  platform: platformEnum.dom,

  create() {
    const el = document.createElement("div");
    el.style.cssText =
      ["position: absolute", "left: 0px", "top: 0px", "box-sizing: border-box", "border: 1px solid #000", "text-align: center"].join(";") + ";";
    this.el = el;

    renderProps.call(this);
  },

  update() {
    BaseRect.prototype.update.call(this);
    renderProps.call(this);
  }
};

function renderProps() {
  const el = this.el;
  el.style.transform = `translate3d(${this.x + (this.width < 0 ? this.width : 0)}px, ${this.y + (this.height < 0 ? this.height : 0)}px, 0)`;
  el.style.width = `${Math.abs(this.width)}px`;
  el.style.height = `${Math.abs(this.height)}px`;
  el.style.lineHeight = `${Math.abs(this.height)}px`;

  if (this.fill) {
    el.style.background = this.fill;
  }

  if (this.image) {
    el.style.background = `url(${this.image}) center/100% 100%`;
  }
}

extend(RectDOM, BaseRect);

export { RectDOM };
