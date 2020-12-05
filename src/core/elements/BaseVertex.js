import { Element } from "../Element";
import { typeEnum } from "../enums";
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

  borderWidth: 1,

  fill: "#fff",

  follow(offset) {
    this.host.followVertex(this, offset);
  },

  addToHost(host) {
    this.host = host;
    this.root = host.root;
    this.root.add(this);
  },

  exportStruct() {}
};

extend(BaseVertex, Element);
mixin(BaseVertex, Draggable);

export { BaseVertex };
