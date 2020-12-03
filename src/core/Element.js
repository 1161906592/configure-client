import { extend, guid, mixin } from "./helpers";
import { Contextmenu } from "./mixins/Contextmenu";
import { Event, platformEnum } from "./Event";
import { rootState } from "./Root";
import { Move } from "./mixins/Move";
import { Resize } from "./mixins/Resize";
/**
 * @description 所有元素的抽象类
 **/

export function Element(opts) {
  Event.call(this, opts);
  Contextmenu.call(this, opts);
  Move.call(this, opts);
  Resize.call(this, opts);
  this.id = guid();
  this.shape = opts.shape;
  this.style = opts.style;
  this.children = [];
}

Element.prototype = {
  constructor: Element,

  // Interface
  render() {},

  mount(root) {
    this.render();
    this.root = root;
    switch (this.platform) {
      case platformEnum.dom:
        root.el.appendChild(this.el);
        break;
      case platformEnum.zr:
        root.zr.add(this.el);
        break;
    }
    switch (root.state) {
      case rootState.rectMove:
        this.addMove();
        break;
      case rootState.drawLine:
        this.addDrawLine?.();
        break;
      case rootState.rectResize:
        this.addResize();
        break;
    }
    this.addContextmenu();
    this.children.forEach(element => {
      root.add(element);
    });
  },

  unmount(root) {
    switch (this.platform) {
      case platformEnum.dom:
        root.el.removeChild(this.el);
        break;
      case platformEnum.zr:
        root.zr.remove(this.el);
        break;
    }
    this.removeMove?.();
    this.removeResize()?.();
    this.removeDrawLine()?.();
    this.offContextmenu?.();
    this.children.forEach(element => {
      root.remove(element);
    });
  },

  // Interface
  follow(offset) {
    this.shape.x += offset.x;
    this.shape.y += offset.y;
    this.setShape(this.shape);

    this.children.forEach(element => {
      element.follow(offset);
    });
  },

  // Interface
  setShape(shape) {
    this.shape = {
      ...this.shape,
      ...shape
    };
  },

  addChild(child) {
    child.parent = this;
    this.children.push(child);
  },

  setData(data) {
    this.data = data;
  }
};

extend(Element, Event);
mixin(Element, Contextmenu);
mixin(Element, Move);
mixin(Element, Resize);

export const typeEnum = {
  rect: "rect",
  line: "line",
  circle: "circle",
  vertex: "vertex"
};
