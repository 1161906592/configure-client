import { Storage } from "./Storage";
import { Painter } from "./Painter";
import { rootStateEnum } from "./enums";
import { HandlerProxy } from "./Handler";
import { Animation } from "@/core/animation/Animation";

function Root(opts) {
  this.el = opts.el;
  this.oncontextmenu = opts.oncontextmenu;
  this.storage = new Storage();
  this.painter = new Painter(this.el);
  this.handlerProxy = new HandlerProxy(this.storage);
  this.root = this;
  this.state = rootStateEnum.off;
  // 选中resize
  this.curResizeElement = null;
  // 画连接线
  this.curDrawLine = null;
  this.isNewPoint = false;

  // 动画
  this.animation = new Animation();
  this.animation.start();
}

Root.prototype = {
  constructor: Root,
  add(element) {
    this.painter.add(element);
    this.storage.add(element);
    this.handlerProxy.addElement(element);
    switch (this.state) {
      case rootStateEnum.focus:
        element.addResize?.();
        element.addDrag?.();
        break;
      case rootStateEnum.drawLine:
        element.addDrawLine?.();
        break;
      case rootStateEnum.drawPolyLine:
        element.addDrawPolyLine?.();
        break;
    }

    // if (element.type === "rect") {
    //   setInterval(() => {
    //     element
    //       .animate("", false)
    //       .when(300, { x: element.x + 5 })
    //       .start();
    //   }, 300);
    // }
  },

  remove(element) {
    element.removeMove?.();
    element.removeResize?.();
    element.removeDrawLinkLine?.();

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
      element.addDrag?.();
      element.addResize?.();
    });
    this.handleKeydown = e => {
      this.curResizeElement?.updateByKeydown?.(e);
    };
    document.addEventListener("keydown", this.handleKeydown);

    this.handleCancelCurFocus = () => {
      this.root.curResizeElement?.removeVertexes();
      this.root.curResizeElement = null;
    };
    document.addEventListener("mousedown", this.handleCancelCurFocus);
  },

  // 结束元素可选择
  endElementFocus() {
    this.state = rootStateEnum.off;
    this.storage.getElementList().forEach(element => {
      element.removeMove?.();
      element.removeResize?.();
    });
    this.curResizeElement = null;

    document.removeEventListener("keydown", this.handleKeydown);
    document.removeEventListener("mousedown", this.handleCancelCurFocus);
  },

  // 画直线
  startDrawLine() {
    if (this.state === rootStateEnum.drawLine) return;
    this.clearHandler();
    this.state = rootStateEnum.drawLine;
    this.storage.getElementList().forEach(element => {
      element.addDrawLine?.();
    });
  },

  // 画折线
  startDrawPolyLine() {
    if (this.state === rootStateEnum.drawPolyLine) return;
    this.clearHandler();
    this.state = rootStateEnum.drawPolyLine;
    this.storage.getElementList().forEach(element => {
      element.addDrawPolyLine?.();
    });
  },

  // 结束画线
  endDrawLine() {
    this.state = rootStateEnum.off;
    this.storage.getElementList().forEach(element => {
      element.removeDrawLinkLine?.();
    });
  },

  export() {
    return {
      width: this.el.clientWidth,
      height: this.el.clientHeight,
      elements: this.storage
        .getElementList()
        .map(element => {
          if (!element.parent) {
            return element.export();
          }
        })
        .filter(Boolean)
    };
  },

  flushRectLineRelation() {
    this.storage.getElementList().forEach(element => {
      if (element.isLinkLine) {
        const startElement = this.storage.getElementById(element.startId);
        element.startElement = startElement;
        startElement.lines.push(element);
        const endElement = this.storage.getElementById(element.endId);
        element.endElement = endElement;
        endElement.lines.push(element);
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
