import { BaseVertex } from "../BaseVertex";
import { extend, mixin } from "../../helpers";
import { CircleImplZR } from "../../mixins/CircleImplZR";
import { platformEnum } from "../../platform";

function VertexZR(opts) {
  BaseVertex.call(this, opts);
  CircleImplZR.call(this, opts);
}

VertexZR.prototype = {
  constructor: VertexZR,

  platform: platformEnum.zr,

  fill: "#fff",

  update(shape) {
    BaseVertex.prototype.update.call(this, shape);
    CircleImplZR.prototype.update.call(this, shape);
  }
};

extend(VertexZR, BaseVertex);
mixin(VertexZR, CircleImplZR);

export { VertexZR };
