import { BaseVertex } from "../BaseVertex";
import { extend, mixin } from "../../helpers";
import { CircleImplZR } from "../../mixins/CircleImplZR";
import { platformEnum } from "../../enums";

function VertexZR(opts) {
  BaseVertex.call(this, opts);
  CircleImplZR.call(this, opts);
}

VertexZR.prototype = {
  constructor: VertexZR,

  platform: platformEnum.zr,

  fill: "#fff"
};

extend(VertexZR, BaseVertex);
mixin(VertexZR, CircleImplZR);

export { VertexZR };
