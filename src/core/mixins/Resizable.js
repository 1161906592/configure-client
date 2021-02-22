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
      this.addVertex(vertex);
    });
  },

  addVertex(vertex) {
    vertex.addToParent(this);
    vertex.mount(this.root);
    this.vertexes.push(vertex);
  },

  // Interface
  makeRectVertexes() {
    return [];
  },

  removeVertexes() {
    this.vertexes.forEach(vertex => {
      vertex.removeFromParent();
      vertex.unmount();
    });
    this.vertexes = [];
  },

  syncWidthVertex(vertex) {
    this.updateShapeByVertex(vertex);
    // this.updateVertexes();
  },

  // Interface
  updateShapeByVertex() {},

  updateVertexes() {
    if (!this.vertexes.length) return;
    this.makeRectVertexes().forEach((point, index) => {
      const vertex = this.vertexes[index];
      vertex.x = point[0];
      vertex.y = point[1];
      vertex.mapToView();
    });
  }
};

export { Resizable };
