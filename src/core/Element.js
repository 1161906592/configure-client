import { eachObj, extend, guid, mixin } from "./helpers";
import { Event } from "./Event";
import { Move } from "./mixins/Move";
/**
 * @description 所有元素的抽象类
 **/

function Element(opts) {
  Event.call(this, opts);
  Move.call(this, opts);
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

  mounted: false,

  // Interface
  create() {},

  mount(root) {
    if (this.mounted) return;
    this.mounted = true;
    this.create();
    this.root = root;
    this.children.forEach(element => {
      root.add(element);
    });
  },

  unmount() {
    if (!this.mounted) return;
    this.mounted = false;
    this.parent?.removeChild(this);
    this.children.forEach(element => {
      this.root.remove(element);
    });
  },

  follow(offset) {
    this.x += offset.x;
    this.y += offset.y;
    this.dirty();

    this.children.forEach(element => {
      element.follow(offset);
    });
  },

  // Interface
  dirty() {},

  addChild(child) {
    child.parent = this;
    this.children.push(child);
    this.mounted && this.root.add(child);
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

extend(Element, Event);
mixin(Element, Move);

export { Element };

export const typeEnum = {
  rect: "rect",
  line: "line",
  circle: "circle",
  vertex: "vertex"
};
