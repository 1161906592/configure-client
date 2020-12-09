function Child() {}

Child.prototype = {
  constructor: Child,

  parent: null,

  parentOffsetX: 0,

  parentOffsetY: 0,

  addToParent(parent) {
    this.parent = parent;

    this.updateOffset();

    parent.isMounted && this.mount(parent.root);
  },

  removeFromParent() {
    this.parent = null;
  },

  syncWithParent() {
    this.attr({
      x: this.parent.x + this.parentOffsetX,
      y: this.parent.y + this.parentOffsetY
    });
  },

  updateOffset() {
    if (!this.parent) return;
    this.parentOffsetX = this.x - this.parent.x;
    this.parentOffsetY = this.y - this.parent.y;
  }
};

export { Child };
