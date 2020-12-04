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
    if (!this.vertexes.length) return;
    this.makeRectVertexes().forEach((point, index) => {
      const item = this.vertexes[index];
      item.x = point[0];
      item.y = point[1];
      item.dirty();
    });
  }
};
