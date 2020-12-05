import { BaseVertex } from "../BaseVertex";
import { extend, mixin } from "../../helpers";
import { CircleImplDOM } from "../../mixins/CircleImplDOM";
import { platformEnum } from "../../platform";

function VertexDOM(opts) {
  BaseVertex.call(this, opts);
  CircleImplDOM.call(this, opts);
}

VertexDOM.prototype = {
  constructor: VertexDOM,

  platform: platformEnum.dom,

  dirty(shape) {
    BaseVertex.prototype.dirty.call(this, shape);
    CircleImplDOM.prototype.dirty.call(this, shape);
  }
};

extend(VertexDOM, BaseVertex);
mixin(VertexDOM, CircleImplDOM);

export { VertexDOM };
