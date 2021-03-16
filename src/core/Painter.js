import { platformEnum } from "./enums";
import { createSvgNode, LinkNode } from "./helpers";

function Painter(root) {
  this.root = root;
  const svg = createSvgNode("svg");
  const rootEl = root.el;

  rootEl.appendChild(svg);

  svg.setAttribute("width", rootEl.clientWidth);
  svg.setAttribute("height", rootEl.clientHeight);

  svg.style.cssText = "position: absolute;left: 0;top:0;";

  this.svgRoot = svg;

  this.zIndexMap = {}; // 按层级分别存储一个双向链表结构用于快速查找新节点的插入位置
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
        removeSvgNode.call(this, element);
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
  if (element.zIndexNode) {
    removeSvgNode.call(this, element);
  } else {
    element.zIndexNode = new LinkNode(element);
  }

  const curNode = element.zIndexNode;

  const nextLevel = Object.keys(this.zIndexMap)
    .sort((a, b) => a - b)
    .find(d => d > element.zIndex);
  this.svgRoot.insertBefore(element.el, this.zIndexMap[nextLevel]?.head.data.el);

  if (this.zIndexMap[element.zIndex]) {
    const item = this.zIndexMap[element.zIndex];
    item.end.next = curNode;
    curNode.prev = item.end;
    item.end = curNode;
  } else {
    this.zIndexMap[element.zIndex] = {
      head: curNode,
      end: curNode
    };
  }
  element.prevZIndex = element.zIndex;
}

function removeSvgNode(element) {
  // 如果移除的是之前作为某个层级的链表head，则需要重新选取该层级的head元素
  const prevHead = this.zIndexMap[element.prevZIndex]?.head;
  const curNode = element.zIndexNode;
  if (prevHead === curNode) {
    const nextNode = prevHead.next;
    if (nextNode) {
      nextNode.prev = null;
      this.zIndexMap[element.prevZIndex].head = prevHead.next;
    } else {
      delete this.zIndexMap[element.prevZIndex];
    }
  }

  // 原链表中删除当前元素
  if (curNode.prev) {
    curNode.prev.next = curNode.next;
  }
  if (curNode.next) {
    curNode.next.prev = curNode.prev;
  }

  curNode.prev = null;
  curNode.next = null;
}

export { Painter };
