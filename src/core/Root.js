import { init } from "zrender";
import { copyProperties, calcDOMOffset, extend } from "./helpers";
import { typeEnum } from "./Element";
import { Event, platformEnum } from "./Event";

export const rootState = {
  off: 1,
  rectMove: 2,
  rectResize: 3,
  drawLine: 4
};

export function Root(opts) {
  opts.platform = platformEnum.dom;
  Event.call(this, opts);
  const el = opts.el;
  el.style.position = "relative";
  this.el = el;
  this.zr = init(el);
  this.oncontextmenu = opts.oncontextmenu;
  this.elements = [];
  this.elementMap = {};
  this.root = this;
  this.offset = calcDOMOffset(el);
  this.state = rootState.rectMove;
  // 画连接线
  this.curDrawLine = null;
  this.curDrawLineStartRect = null;
  this.isNewPoint = false;
  // 缩放
  this.curResizeElement = null;
}

Root.prototype = {
  constructor: Root,
  add(element) {
    console.log(element);
    element.mount(this);
    this.elements.push(element);
    this.elementMap[element.id] = element;
  },

  remove(element) {
    element.unmount(this);
    const idx = this.elements.findIndex(d => d === element);
    if (idx !== -1) {
      this.elements.splice(idx, 1);
      delete this.elementMap[element.id];
    }
  },

  clearHandler() {
    this.endDrawLine();
    this.endRectMove();
    this.endRectResize();
  },

  // 移动方块
  startElementMove() {
    if (this.state === rootState.rectMove) return;
    this.clearHandler();
    this.state = rootState.rectMove;
    this.elements.forEach(element => {
      element.addMove();
    });
  },

  endRectMove() {
    if (this.state !== rootState.rectMove) return;
    this.state = rootState.off;
    this.elements.forEach(element => {
      element.removeMove();
    });
  },

  // 画线
  startDrawLine() {
    if (this.state === rootState.drawLine) return;
    this.clearHandler();
    this.state = rootState.drawLine;
    this.elements.forEach(element => {
      element.addDrawLine?.();
    });
  },

  endDrawLine() {
    if (this.state !== rootState.drawLine) return;
    this.state = rootState.off;
    this.elements.forEach(element => {
      element.removeDrawLine?.();
    });
  },

  // 缩放
  startRectResize() {
    if (this.state === rootState.rectResize) return;
    this.clearHandler();
    this.state = rootState.rectResize;
    this.elements.forEach(element => {
      element.addResize();
    });
  },

  endRectResize() {
    if (this.state !== rootState.rectResize) return;
    this.state = rootState.off;
    this.elements.forEach(element => {
      element.removeResize();
    });
  },

  getResult() {
    return this.elements
      .map(element => {
        let result;
        switch (element.type) {
          case typeEnum.rect:
            result = copyProperties(element, ["id", "type", "shape", "lines", "platform", "image", "data"]);
            result.shape = copyProperties(result.shape, ["x", "y", "width", "height"]);
            return result;
          case typeEnum.line:
            result = copyProperties(element, ["id", "type", "shape", "lines", "platform", "isStartVertical", "isEndVertical", "data"]);
            result.shape = copyProperties(result.shape, ["points"]);
            return result;
        }
      })
      .filter(Boolean);
  }
};

extend(Root, Event);
