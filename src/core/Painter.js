import { platformEnum } from "./enums";
import { createSvgNode } from "./helpers";

function Painter(root) {
  this.root = root;
  const svg = createSvgNode("svg");
  const rootEl = root.el;

  rootEl.appendChild(svg);

  svg.setAttribute("width", rootEl.clientWidth);
  svg.setAttribute("height", rootEl.clientHeight);

  svg.style.cssText = "position: absolute;left: 0;top:0;";

  this.svgRoot = svg;

  this.zIndexStartMap = {};
  this.zIndexList = [];
}

Painter.prototype = {
  constructor: Painter,

  add(element) {
    switch (element.platform) {
      case platformEnum.dom:
        this.domRoot.appendChild(element.el);
        break;
      case platformEnum.zr:
        this.zrRoot.add(element.el);
        break;
      case platformEnum.svg:
        insertSvgNode.call(this, element);
        break;
    }
  },

  remove(element) {
    switch (element.platform) {
      case platformEnum.dom:
        this.domRoot.removeChild(element.el);
        break;
      case platformEnum.zr:
        this.zrRoot.remove(element.el);
        break;
      case platformEnum.svg:
        this.svgRoot.removeChild(element.el);
        break;
    }
  },

  updateElement(element) {
    if (element.prevZIndex !== element.zIndex) {
      insertSvgNode.call(this, element);
    }
  }
};

function insertSvgNode(element) {
  let nextLevel = this.zIndexList.find(d => d > element.zIndex);
  this.svgRoot.insertBefore(element.el, this.zIndexStartMap[nextLevel]?.el);
  if (!this.zIndexStartMap[element.zIndex]) {
    this.zIndexStartMap[element.zIndex] = element;
    this.zIndexList.push(element.zIndex);
    this.zIndexList.sort((a, b) => a - b);
  }
  // 如果改变的是之前作为某个层级的起始元素，则需要重新选取该层级的起始元素
  if (this.zIndexStartMap[element.prevZIndex] === element) {
    this.zIndexStartMap[element.prevZIndex] = this.root.storage.getElementList().find(d => d.zIndex === element.prevZIndex);
  }
  element.prevZIndex = element.zIndex;
}

export { Painter };
