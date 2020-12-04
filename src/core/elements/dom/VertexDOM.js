import { BaseVertex } from "../BaseVertex";
import { extend, mixin } from "../../helpers";
import { CircleImplDOM } from "../../mixins/CircleImplDOM";
import { platformEnum } from "../../Event";

export function VertexDOM(opts) {
  BaseVertex.call(this, opts);
  CircleImplDOM.call(this, opts);
  this.platform = platformEnum.dom;
}

VertexDOM.prototype = {
  constructor: VertexDOM,

  dirty(shape) {
    BaseVertex.prototype.dirty.call(this, shape);
    CircleImplDOM.prototype.dirty.call(this, shape);
  }
};

extend(VertexDOM, BaseVertex);
mixin(VertexDOM, CircleImplDOM);
