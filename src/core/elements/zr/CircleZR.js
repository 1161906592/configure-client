import { platformEnum } from "../../Event";
import { extend, mixin } from "../../helpers";
import { BaseCircle } from "../BaseCircle";
import { VertexZR } from "./VertexZR";
import { CircleImplZR } from "../../mixins/CircleImplZR";

export function CircleZR(opts) {
  BaseCircle.call(this, opts);
  CircleImplZR.call(this, opts);
  this.platform = platformEnum.zr;
  this.fill = "rgba(0, 0, 0, 0)";
}

CircleZR.prototype = {
  constructor: CircleZR,

  setShape(shape) {
    BaseCircle.prototype.setShape.call(this, shape);
    CircleImplZR.prototype.setShape.call(this, shape);
  },

  makeVertex(opts) {
    return new VertexZR(opts);
  }
};

extend(CircleZR, BaseCircle);
mixin(CircleZR, CircleImplZR);
