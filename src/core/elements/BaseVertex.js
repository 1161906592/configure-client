import { Element, typeEnum } from "../Element";
import { extend } from "../helpers";
export function BaseVertex(opts) {
  Element.call(this, opts);
  this.type = typeEnum.vertex;
  this.shape.r = 4;
  this.fill = "#fff";
  this.index = opts.index;
}

BaseVertex.prototype = {
  constructor: BaseVertex,

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
  }
};

extend(BaseVertex, Element);
