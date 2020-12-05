import { platformEnum } from "../../platform";
import { extend, mixin } from "../../helpers";
import { BaseCircle } from "../BaseCircle";
import { CircleImplZR } from "../../mixins/CircleImplZR";

function CircleZR(opts) {
  BaseCircle.call(this, opts);
  CircleImplZR.call(this, opts);
}

CircleZR.prototype = {
  constructor: CircleZR,

  platform: platformEnum.zr,

  fill: "rgba(0, 0, 0, 0)",

  update(shape) {
    BaseCircle.prototype.update.call(this, shape);
    CircleImplZR.prototype.update.call(this, shape);
  }
};

extend(CircleZR, BaseCircle);
mixin(CircleZR, CircleImplZR);

export { CircleZR };
