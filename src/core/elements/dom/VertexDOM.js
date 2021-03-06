import { BaseVertex } from "../BaseVertex";
import { extend, mixin } from "../../helpers";
import { CircleImplDOM } from "../../mixins/CircleImplDOM";
import { platformEnum } from "../../enums";

function VertexDOM(opts) {
  BaseVertex.call(this, opts);
  CircleImplDOM.call(this, opts);
}

VertexDOM.prototype = {
  constructor: VertexDOM,

  platform: platformEnum.dom
};

extend(VertexDOM, BaseVertex);
mixin(VertexDOM, CircleImplDOM);

export { VertexDOM };
