import { Element } from "../Element";
import { extend } from "../helpers";
import { typeEnum } from "../enums";
import { createElement } from "../createElement";

// 所有连接线的抽象类
function BaseLinkLine(opts) {
  Element.call(this, opts);
}

BaseLinkLine.prototype = {
  constructor: BaseLinkLine,

  useArrow: false,

  create() {
    this.useArrow && this.addArrow();
  },

  mount(root) {
    Element.prototype.mount.call(this, root);
    this.arrow && this.root.add(this.arrow);
  },

  unmount() {
    Element.prototype.unmount.call(this);
    this.startElement.removeLine(this);
    this.endElement.removeLine(this);
    this.removeArrow();
  },

  update() {
    Element.prototype.update.call(this);
    this.useArrow ? this.addArrow() : this.removeArrow();
  },

  addArrow() {
    if (this.arrow) return;
    const [last, last2] = this.makeArrowVertex();
    this.arrow = createElement({
      type: typeEnum.arrow,
      platform: this.platform,
      x: last[0],
      y: last[1],
      rotation: calcRotation(last2, last),
      line: this
    });
    this.isMounted && this.arrow.mount(this.root);
  },

  // Interface
  makeArrowVertex() {},

  removeArrow() {
    if (!this.arrow || !this.arrow.isMounted) return;
    this.arrow.unmount();
  },

  export() {
    return {
      ...Element.prototype.export.call(this),
      useArrow: this.useArrow
    };
  }
};

extend(BaseLinkLine, Element);

function calcRotation(p1, p2) {
  return Math.atan2(p1[1] - p2[1], p2[0] - p1[0]) - Math.PI / 2;
}

export { BaseLinkLine };
