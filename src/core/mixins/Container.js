import { PolylineLinkable } from "./PolylineLinkable";
import { mixin } from "../helpers";
import { LineLinkable } from "./LineLinkable";

// 容器的抽象类 混入此类的类可以添加children 可以添加连接线
function Container(opts) {
  PolylineLinkable.call(this, opts);
  LineLinkable.call(this, opts);
  this.children = [];
}

Container.prototype = {
  constructor: Container,

  isContainer: true,

  update() {
    this.updateLines();
    this.children.forEach(child => {
      child.syncWithParent();
    });
  },

  addChild(child) {
    this.children.push(child);
    child.addToParent(this);
  },

  removeChild(child) {
    const idx = this.children.findIndex(d => d === child);
    if (idx !== -1) {
      this.children.splice(idx, 1);
    }
    child.removeFromParent(this);
  },

  mount(root) {
    this.children.forEach(element => {
      element.mount(root);
    });
  },

  unmount() {
    this.children.forEach(element => {
      element.unmount();
    });
    this.clearLine();
  },

  export() {
    return {
      children: this.children.map(element => {
        return element.export();
      })
    };
  }
};

mixin(Container, PolylineLinkable);
mixin(Container, LineLinkable);

export { Container };
