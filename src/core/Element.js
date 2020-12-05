import { eachObj, extend, guid } from "./helpers";
import { Eventful } from "./Eventful";
/**
 * @description 所有元素的抽象类
 **/

function Element(opts) {
  Eventful.call(this, opts);
  eachObj(opts, (value, key) => {
    this[key] = value;
  });
  this.id = opts.id || guid();
  this.children = [];
  this.create();
}

Element.prototype = {
  constructor: Element,

  x: 0,

  y: 0,

  isMounted: false,

  // Interface
  create() {},

  mount(root) {
    if (this.isMounted) return;
    this.root = root;
    this.children.forEach(element => {
      root.add(element);
    });
    this.isMounted = true;
  },

  unmount() {
    if (!this.isMounted) return;
    this.isMounted = false;
    this.parent?.removeChild(this);
    this.children.forEach(element => {
      this.root.remove(element);
    });
  },

  // Interface
  update() {},

  addChild(child) {
    child.parent = this;
    this.children.push(child);
    this.isMounted && this.root.add(child);
  },

  removeChild(child) {
    this.children.splice(
      this.children.findIndex(d => d === child),
      1
    );
  },

  exportStruct() {
    return {
      type: this.type,
      platform: this.platform,
      id: this.id,
      x: this.x,
      y: this.y,
      children: this.children.map(element => {
        return element.exportStruct();
      })
    };
  }
};

extend(Element, Eventful);

export { Element };

export const typeEnum = {
  rect: "rect",
  line: "line",
  circle: "circle",
  vertex: "vertex",
  arrow: "arrow"
};
