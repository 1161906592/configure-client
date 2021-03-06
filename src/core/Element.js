import { eachObj, guid, handleKeyEvent, mixin } from "./helpers";
import { Eventful } from "./Eventful";
import { Child } from "./mixins/Child";
import { Animatable } from "@/core/mixins/Animatable";
import { Draggable } from "@/core/mixins/Draggable";
/**
 * @description 所有元素的抽象类
 **/

function Element(opts) {
  Eventful.call(this, opts);
  Child.call(this, opts);
  Draggable.call(this, opts);
  Animatable.call(this, opts);
  eachObj(opts, (value, key) => {
    this[key] = value;
  });
  this.id = opts.id || guid();
  this.create();
  this.onCreated?.();
}

Element.prototype = {
  constructor: Element,

  x: 0,

  y: 0,

  root: null,

  el: null,

  extData: {},

  customData: {},

  isMounted: false,

  zIndex: 1,

  // Interface
  create() {},

  mount(root) {
    if (this.isMounted) return;
    this.root = root;
    root.add(this);
    this.isMounted = true;

    this.onMounted?.();
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
    this.root.painter.updateElement(this);
  },

  unmount() {
    if (!this.isMounted) return;
    this.removeFromParent();
    this.root.remove(this);
    this.isMounted = false;

    this.onUnmount?.();
  },

  // Interface
  mapToView() {},

  updateByKeydown(e) {
    updateByKeydown.call(this, e);
  },

  export() {
    return {
      type: this.type,
      platform: this.platform,
      id: this.id,
      x: this.x,
      y: this.y,
      zIndex: this.zIndex,
      extData: this.extData,
      customData: this.customData
    };
  }
};

mixin(Element, Eventful);
mixin(Element, Child);
mixin(Element, Animatable);
mixin(Element, Draggable);

function updateByKeydown(e) {
  handleKeyEvent(e, {
    ArrowUp: () => {
      this.attr("y", this.y - 1);
    },
    ArrowRight: () => {
      this.attr("x", this.x + 1);
    },
    ArrowDown: () => {
      this.attr("y", this.y + 1);
    },
    ArrowLeft: () => {
      this.attr("x", this.x - 1);
    },
    Delete: () => {
      this.unmount();
    }
  });
}

export { Element };
