import { Element, typeEnum } from "../Element";
import { extend } from "../helpers";
function BaseVertex(opts) {
  Element.call(this, opts);
}

BaseVertex.prototype = {
  constructor: BaseVertex,

  type: typeEnum.vertex,

  r: 4,

  fill: "#fff",

  follow(offset) {
    // 顶点不继承element的follow行为
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

export { BaseVertex };
