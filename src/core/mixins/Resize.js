export function Resize(opts) {
  this.vertexes = opts.vertexes || [];
}

Resize.prototype = {
  constructor: Resize,
  addResize() {
    const click = () => {
      if (this.vertexes.length) return;
      this.addVertexes();
    };
    this.on("click", click);
    this.removeResize = () => {
      this.off("click", click);
      this.removeVertexes();
    };
  },
  addVertexes() {},
  removeVertexes() {}
};
