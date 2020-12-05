import { Element, typeEnum } from "../Element";
import { extend, mixin } from "../helpers";
import { Draggable } from "../mixins/Draggable";
function BaseVertex(opts) {
  Element.call(this, opts);
  Draggable.call(this, opts);
}

BaseVertex.prototype = {
  constructor: BaseVertex,

  type: typeEnum.vertex,

  r: 4,

  fill: "#fff",

  follow(offset) {
    this.host.followVertex(this, offset);
  },

  addToHost(host) {
    this.host = host;
    this.root = host.root;
    this.root.add(this);
  },

  removeFromHost() {
    this.root.remove(this);
  },

  exportStruct() {}
};

extend(BaseVertex, Element);
mixin(BaseVertex, Draggable);

export { BaseVertex };
