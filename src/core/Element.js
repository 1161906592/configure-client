import { eachObj, guid, mixin } from "./helpers";
import { Eventful } from "./Eventful";
import { Child } from "./mixins/Child";
/**
 * @description 所有元素的抽象类
 **/

function Element(opts) {
  Eventful.call(this, opts);
  Child.call(this, opts);
  eachObj(opts, (value, key) => {
    this[key] = value;
  });
  this.id = opts.id || guid();
  this.create();
}

Element.prototype = {
  constructor: Element,

  x: 0,

  y: 0,

  root: null,

  el: null,

  data: {},

  isMounted: false,

  // Interface
  create() {},

  mount(root) {
    if (this.isMounted) return;
    this.root = root;
    root.add(this);
    this.isMounted = true;
  },

  attr(key, value) {
    if (typeof key === "object") {
      eachObj(key, (value, key) => {
        this[key] = value;
      });
    } else {
      this[key] = value;
    }
    this.update();
  },

  update() {
    this.mapToView();
    this.updateOffset();
  },

  unmount() {
    if (!this.isMounted) return;
    this.parent?.removeChild(this);
    this.root.remove(this);
    this.isMounted = false;
  },

  // Interface
  mapToView() {},

  export() {
    return {
      type: this.type,
      platform: this.platform,
      id: this.id,
      x: this.x,
      y: this.y,
      data: this.data
    };
  }
};

mixin(Element, Eventful);
mixin(Element, Child);

export { Element };
