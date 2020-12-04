export function Resize() {
  this.vertexes = [];
}

Resize.prototype = {
  constructor: Resize,
  addResize() {
    const mousedown = () => {
      if (this.vertexes.length) return;
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
      const vertex = this.makeVertex({
        shape: {
          x: point[0],
          y: point[1]
        },
        index
      });
      vertex.addToHost(this);
      this.vertexes.push(vertex);
    });
  },
  // Interface
  makeRectVertexes() {},
  // Interface
  makeVertex() {},

  removeVertexes() {
    this.vertexes.forEach(vertex => {
      vertex.removeFromHost();
    });
    this.vertexes = [];
  },
  follow() {
    this.updateVertexes();
  },
  followVertex(vertex, offset) {
    this.updateShape(vertex, offset);
    this.updateVertexes();
  },
  // Interface
  updateShape() {},
  updateVertexes() {
    this.makeRectVertexes().forEach((point, index) => {
      this.vertexes[index].setShape({
        x: point[0],
        y: point[1]
      });
    });
  }
};
