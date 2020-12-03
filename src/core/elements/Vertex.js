import { addVertexResize } from "../handler/rectResize";
import { typeEnum } from "../Element";

export function Vertex() {
  this.type = typeEnum.vertex;
  this.shape = {
    ...this.shape,
    r: 4
  };
}

Vertex.prototype = {
  followHost(offset) {
    this.follow(offset);
    this.host.followVertex(this, offset);
  },

  addToHost(host, index) {
    this.host = host;
    this.index = index;
    this.root = host.root;
    this.root.add(this);
    this.startResize();
  },

  removeFromHost() {
    this.endResize();
    this.root.remove(this);
  },

  startResize() {
    this.endResize = addVertexResize(this);
  },

  endResize() {}
};
