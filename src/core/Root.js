import { Storage } from "./Storage";
import { Painter } from "./Painter";
import { rootStateEnum } from "./enums";
import { HandlerProxy } from "./Handler";

function Root(opts) {
  this.el = opts.el;
  this.oncontextmenu = opts.oncontextmenu;
  this.storage = new Storage();
  this.painter = new Painter(this.el);
  this.handlerProxy = new HandlerProxy(this.storage);
  this.root = this;
  this.state = opts.state || rootStateEnum.rectMove;
  // 选中resize
  this.curResizeElement = null;
  // 画连接线
  this.curDrawLine = null;
  this.curDrawLineStartElement = null;
  this.isNewPoint = false;
}

Root.prototype = {
  constructor: Root,
  add(element) {
    // console.log(element);
    element.mount(this);
    this.painter.add(element);
    this.storage.add(element);
    this.handlerProxy.addElement(element);

    switch (this.state) {
      case rootStateEnum.focus:
        element.addMove?.();
        element.addResize?.();
        break;
      case rootStateEnum.drawLine:
        element.addDrawLine?.();
        break;
    }
  },

  remove(element) {
    element.unmount(this);
    element.removeMove?.();
    element.removeResize?.();
    element.removeDrawLine?.();

    this.painter.remove(element);
    this.storage.remove(element);
    this.handlerProxy.removeElement(element);
  },

  clearHandler() {
    this.endDrawLine();
    this.endElementFocus();
  },

  startFocus() {
    if (this.state === rootStateEnum.focus) return;
    this.clearHandler();
    this.state = rootStateEnum.focus;
    this.storage.getElementList().forEach(element => {
      element.addMove?.();
      element.addResize?.();
    });
  },

  endElementFocus() {
    if (this.state !== rootStateEnum.focus) return;
    this.state = rootStateEnum.off;
    this.storage.getElementList().forEach(element => {
      element.removeMove?.();
      element.removeResize?.();
    });
    this.curResizeElement = null;
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
    return {
      width: this.el.clientWidth,
      height: this.el.clientHeight,
      elements: this.storage
        .getElementList()
        .map(element => {
          if (!element.parent) {
            return element.exportStruct();
          }
        })
        .filter(Boolean)
    };
  },

  flushRectLineRelation() {
    this.storage.getElementList().forEach(element => {
      if (element.isContainer) {
        element.lines.forEach(item => {
          item.line = this.storage.getElementById(item.id);
          if (item.isStart) {
            item.line.startElement = element;
          } else {
            item.line.endElement = element;
          }
        });
      }
    });
  },

  on(type, handler) {
    this.handlerProxy.on(type, handler);
  },

  off(type, handler) {
    this.handlerProxy.off(type, handler);
  }
};

export { Root };
