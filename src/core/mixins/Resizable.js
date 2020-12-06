import { createElement } from "../index";
import { typeEnum } from "../enums";

function Resizable() {
  this.vertexes = [];
}

Resizable.prototype = {
  constructor: Resizable,

  addResize() {
    const mousedown = () => {
      if (this.root.curResizeElement === this) return;
      this.root.curResizeElement?.removeVertexes();
      this.root.curResizeElement = this;
      this.addVertexes();
    };
    this.on("mousedown", mousedown);
    this.removeResize = () => {
      this.off("mousedown", mousedown);
      this.removeVertexes();
    };
  },

  addVertexes() {
    this.makeRectVertexes().forEach((point, index) => {
      const vertex = createElement({
        type: typeEnum.vertex,
        platform: this.platform,
        x: point[0],
        y: point[1],
        index
      });
      vertex.addToHost(this);
      this.vertexes.push(vertex);
    });
  },

  // Interface
  makeRectVertexes() {},

  removeVertexes() {
    this.vertexes.forEach(vertex => {
      this.root.remove(vertex);
    });
    this.vertexes = [];
  },

  followVertex(vertex, offset) {
    this.updateShape(vertex, offset);
    this.updateVertexes();
  },

  // Interface
  updateShape() {},

  updateVertexes() {
    if (!this.vertexes.length) return;
    this.makeRectVertexes().forEach((point, index) => {
      const item = this.vertexes[index];
      item.x = point[0];
      item.y = point[1];
      item.update();
    });
  }
};

export { Resizable };
