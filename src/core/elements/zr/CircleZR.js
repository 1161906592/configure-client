import { platformEnum } from "../../enums";
import { extend, mixin } from "../../helpers";
import { BaseCircle } from "../BaseCircle";
import { CircleImplZR } from "../../mixins/CircleImplZR";
import { ToggleZRImage } from "../../mixins/ToggleZRImage";

function CircleZR(opts) {
  BaseCircle.call(this, opts);
  CircleImplZR.call(this, opts);
  ToggleZRImage.call(this, opts);
}

CircleZR.prototype = {
  constructor: CircleZR,

  platform: platformEnum.zr,

  fill: "rgba(0, 0, 0, 0)",

  update(shape) {
    BaseCircle.prototype.update.call(this, shape);
    CircleImplZR.prototype.update.call(this, shape);
  },

  on(type, handler) {
    BaseCircle.prototype.on.call(this, type, handler);
    ToggleZRImage.prototype.on.call(this, type, handler);
  },

  off(type, handler) {
    BaseCircle.prototype.off.call(this, type, handler);
    ToggleZRImage.prototype.off.call(this, type, handler);
  }
};

extend(CircleZR, BaseCircle);
mixin(CircleZR, CircleImplZR);
mixin(CircleZR, ToggleZRImage);

export { CircleZR };
