import { extend } from "./helpers";
import { Event } from "./Event";
import { platformEnum } from "./platform";
import { Storage } from "./Storage";
import { Painter } from "./Painter";
import { typeEnum } from "./Element";
import { addContextmenu } from "./Contextmenu";

export const rootStateEnum = {
  off: 1,
  focus: 2,
  drawLine: 3
};

function Root(opts) {
  Event.call(this, opts);
  this.el = opts.el;
  this.oncontextmenu = opts.oncontextmenu;
  this.storage = new Storage();
  this.painter = new Painter(this.el);
  this.root = this;
  this.state = opts.state || rootStateEnum.rectMove;
  // 画连接线
  this.curDrawLine = null;
  this.curDrawLineStartRect = null;
  this.isNewPoint = false;
}

Root.prototype = {
  constructor: Root,
  platform: platformEnum.dom,
  add(element) {
    console.log(element);
    element.mount(this);
    this.painter.add(element);
    this.storage.add(element);

    switch (this.state) {
      case rootStateEnum.focus:
        element.addMove();
        element.addResize?.();
        break;
      case rootStateEnum.drawLine:
        element.addDrawLine?.();
        break;
    }
    element.addContextmenu?.();
    addContextmenu(element, this.oncontextmenu);
  },

  remove(element) {
    element.unmount(this);
    element.removeMove?.();
    element.removeResize?.();
    element.removeDrawLine?.();
    element.offContextmenu?.();

    this.painter.remove(element);
    this.storage.remove(element);
  },

  clearHandler() {
    this.endDrawLine();
    this.endRectFocus();
  },

  startFocus() {
    if (this.state === rootStateEnum.focus) return;
    this.clearHandler();
    this.state = rootStateEnum.focus;
    this.elements.forEach(element => {
      element.addMove();
      element.addResize?.();
    });
  },

  endRectFocus() {
    if (this.state !== rootStateEnum.focus) return;
    this.state = rootStateEnum.off;
    this.storage.getElementList().forEach(element => {
      element.removeMove();
      element.removeResize?.();
    });
  },

  // 画线
  startDrawLine() {
    if (this.state === rootStateEnum.drawLine) return;
    this.clearHandler();
    this.state = rootStateEnum.drawLine;
    this.storage.getElementList().forEach(element => {
      element.addDrawLine?.();
    });
  },

  endDrawLine() {
    if (this.state !== rootStateEnum.drawLine) return;
    this.state = rootStateEnum.off;
    this.storage.getElementList().forEach(element => {
      element.removeDrawLine?.();
    });
  },

  exportStruct() {
    return this.storage
      .getElementList()
      .map(element => {
        if (!element.parent) {
          return element.exportStruct();
        }
      })
      .filter(Boolean);
  },

  flushRectLineRelation() {
    this.storage.getElementList().forEach(element => {
      if (element.type === typeEnum.rect) {
        element.lines.forEach(item => {
          item.line = this.storage.getElementById(item.id);
          if (item.isStart) {
            item.line.startRect = element;
          } else {
            item.line.endRect = element;
          }
        });
      }
    });
  }
};

extend(Root, Event);

export { Root };
