import { Element, typeEnum } from "../Element";
import { rootState } from "../Root";
import { extend, makeRectVertexes, mixin } from "../helpers";
import { elementFollowResize, lineFollowElement, vertexFollowElement } from "../handler/rectResize";
import { DrawLine } from "../mixins/DrawLine";

export function BaseRect(opts) {
  Element.call(this, opts);
  DrawLine.call(this, opts);
  this.type = typeEnum.rect;
  this.shape = {
    x: 0,
    y: 0,
    width: 200,
    height: 100,
    ...this.shape
  };

  this.image = opts.image;
  this.lines = this.lines || [];
}

BaseRect.prototype = {
  constructor: BaseRect,

  mount(root) {
    Element.prototype.mount.call(this, root);
    switch (root.state) {
      case rootState.drawLine:
        this.addDrawLine();
        break;
    }
  },

  unmount(root) {
    Element.prototype.unmount.call(this, root);
    this.removeDrawLine();
  },

  // 跟随鼠标
  follow(offset) {
    Element.prototype.follow.call(this, offset);

    const elementMap = this.root.elementMap;
    this.lines.forEach(item => {
      const line = elementMap[item.id];
      line.isFollowStart = item.isStart;
      line.followHost(offset);
    });
  },

  // 添加顶点
  addVertexes() {
    makeRectVertexes(this).forEach((point, index) => {
      const vertex = this.makeVertex({
        shape: {
          x: point[0],
          y: point[1]
        }
      });
      vertex.addToHost(this, index);
      this.vertexes.push(vertex);
    });
  },

  removeVertexes() {
    this.vertexes.forEach(vertex => {
      vertex.removeFromHost();
    });
    this.vertexes = [];
  },

  makeVertex() {},

  followVertex(vertex, offset) {
    elementFollowResize(this, vertex, offset);
    this.setShape(this.shape);
    vertexFollowElement(this);
    lineFollowElement(this, vertex, offset);
  },

  setImage(image) {
    this.image = image;
  }
};

extend(BaseRect, Element);
mixin(BaseRect, DrawLine);
