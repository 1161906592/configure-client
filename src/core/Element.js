import { extend, guid, mixin } from "./helpers";
import { Contextmenu } from "./mixins/Contextmenu";
import { Event, platformEnum } from "./Event";
import { Move } from "./mixins/Move";
/**
 * @description 所有元素的抽象类
 **/

export function Element(opts) {
  Event.call(this, opts);
  Contextmenu.call(this, opts);
  Move.call(this, opts);
  this.id = guid();
  this.x = opts.x || 0;
  this.y = opts.y || 0;
  this.children = [];
}

Element.prototype = {
  constructor: Element,

  // Interface
  render() {},

  mount(root) {
    this.initEvent();
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
    this.children.forEach(element => {
      root.remove(element);
    });
  },

  // Interface
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
  },

  setData(data) {
    this.data = data;
  }
};

extend(Element, Event);
mixin(Element, Contextmenu);
mixin(Element, Move);

export const typeEnum = {
  rect: "rect",
  line: "line",
  circle: "circle",
  vertex: "vertex"
};
