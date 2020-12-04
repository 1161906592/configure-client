import { init } from "zrender";
import { copyProperties, calcDOMOffset, extend } from "./helpers";
import { typeEnum } from "./Element";
import { Event, platformEnum } from "./Event";

export const rootState = {
  off: 1,
  focus: 2,
  drawLine: 3
};

export function Root(opts) {
  Event.call(this, opts);
  this.platform = platformEnum.dom;
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
  this.initEvent();
}

Root.prototype = {
  constructor: Root,
  add(element) {
    console.log(element);
    element.mount(this);
    switch (this.state) {
      case rootState.focus:
        element.addMove();
        element.addResize?.();
        break;
      case rootState.drawLine:
        element.addDrawLine?.();
        break;
      // case rootState.rectResize:
      //   element.addResize();
      //   break;
    }
    element.addContextmenu();
    this.elements.push(element);
    this.elementMap[element.id] = element;
  },

  remove(element) {
    element.unmount(this);
    element.removeMove?.();
    element.removeResize?.();
    element.removeDrawLine?.();
    element.offContextmenu?.();
    const idx = this.elements.findIndex(d => d === element);
    if (idx !== -1) {
      this.elements.splice(idx, 1);
      delete this.elementMap[element.id];
    }
  },

  clearHandler() {
    this.endDrawLine();
    this.endRectFocus();
  },

  startFocus() {
    if (this.state === rootState.focus) return;
    this.clearHandler();
    this.state = rootState.focus;
    this.elements.forEach(element => {
      element.addMove();
      element.addResize?.();
    });
  },

  endRectFocus() {
    if (this.state !== rootState.focus) return;
    this.state = rootState.off;
    this.elements.forEach(element => {
      element.removeMove();
      element.removeResize?.();
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
