import { platformEnum } from "../../enums";
import { extend, mixin } from "../../helpers";
import { BaseCircle } from "../BaseCircle";
import { CircleImplZR } from "../../mixins/CircleImplZR";
import { CircleImplSvg } from "../../mixins/CircleImplSvg";

function CircleSvg(opts) {
  BaseCircle.call(this, opts);
  CircleImplZR.call(this, opts);
}

CircleSvg.prototype = {
  constructor: CircleSvg,

  platform: platformEnum.svg,

  fill: "rgba(0, 0, 0, 0)"
};

extend(CircleSvg, BaseCircle);
mixin(CircleSvg, CircleImplSvg);

export { CircleSvg };
