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

  data: {},

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

  follow(offset) {
    this.x += offset.x;
    this.y += offset.y;
    this.update();

    this.children.forEach(element => {
      element.follow(offset);
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
    const idx = this.children.findIndex(d => d === child);
    if (idx !== -1) {
      this.children.splice(idx, 1);
    }
  },

  defaultMerge(configuration) {
    eachObj(configuration, (value, key) => {
      if (key !== "x" && key !== "y") {
        this[key] = value;
      }
    });
    // 设置位置
    const offset = { x: 0, y: 0 };
    if (configuration.x !== undefined) {
      offset.x = configuration.x - this.x;
    }
    if (configuration.y !== undefined) {
      offset.y = configuration.y - this.y;
    }
    return offset;
  },

  // 默认之作
  setConfiguration(configuration) {
    const offset = this.defaultMerge(configuration);
    this.follow(offset);
    this.update();
  },

  exportStruct() {
    return {
      type: this.type,
      platform: this.platform,
      id: this.id,
      x: this.x,
      y: this.y,
      data: this.data,
      children: this.children.map(element => {
        return element.exportStruct();
      })
    };
  }
};

extend(Element, Eventful);

export { Element };
