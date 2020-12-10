import { BaseVertex } from "../BaseVertex";
import { extend, mixin } from "../../helpers";
import { platformEnum } from "../../enums";
import { CircleImplSvg } from "../../mixins/CircleImplSvg";

function VertexSvg(opts) {
  BaseVertex.call(this, opts);
  CircleImplSvg.call(this, opts);
}

VertexSvg.prototype = {
  constructor: VertexSvg,

  platform: platformEnum.svg,

  fill: "#fff"
};

extend(VertexSvg, BaseVertex);
mixin(VertexSvg, CircleImplSvg);

export { VertexSvg };
