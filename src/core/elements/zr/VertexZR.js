import { BaseVertex } from "../BaseVertex";
import { extend, mixin } from "../../helpers";
import { CircleImplZR } from "../../mixins/CircleImplZR";
import { platformEnum } from "../../Event";

export function VertexZR(opts) {
  BaseVertex.call(this, opts);
  CircleImplZR.call(this, opts);
  this.platform = platformEnum.zr;
  this.fill = "#fff";
}

VertexZR.prototype = {
  constructor: VertexZR,
  dirty(shape) {
    BaseVertex.prototype.dirty.call(this, shape);
    CircleImplZR.prototype.dirty.call(this, shape);
  }
};

extend(VertexZR, BaseVertex);
mixin(VertexZR, CircleImplZR);
