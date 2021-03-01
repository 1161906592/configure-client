import { createElement } from "../index";
import { typeEnum } from "../enums";

function Resizable() {
  this.vertexes = [];
}

Resizable.prototype = {
  constructor: Resizable,

  addResize() {
    const mousedown = e => {
      e.event.stopPropagation();

      if (this.root.curResizeElement !== this) {
        this.root.curResizeElement?.onblur();
        this.root.curResizeElement = this;
        this.addVertexes();
      }

      this.onfocus([e.offsetX, e.offsetY]);
    };
    this.on("mousedown", mousedown);
    this.removeResize = () => {
      this.off("mousedown", mousedown);
      this.onblur();
    };
  },

  addVertexes() {
    this.makeRectVertexes().forEach((point, index) => {
      this.insertVertex(index, point);
    });
  },

  // 插入顶点 Vertex 元素 不是插入points
  insertVertex(index, point) {
    const vertex = createElement({
      type: typeEnum.vertex,
      platform: this.platform,
      x: point[0],
      y: point[1],
      index
    });
    vertex.addToParent(this);
    this.vertexes.splice(index, 0, vertex);
  },

  // Interface
  makeRectVertexes() {
    return [];
  },

  // Interface
  onfocus() {},

  onblur() {
    this.vertexes.forEach(vertex => {
      vertex.unmount();
    });
    this.vertexes = [];
    // 失去焦点时调用关联元素的 onblur
    this.lines?.forEach(line => {
      line.onblur?.();
    });
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
