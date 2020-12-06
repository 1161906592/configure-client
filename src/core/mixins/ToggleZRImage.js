import { BaseRect } from "../elements/BaseRect";

function ToggleZRImage() {
  this.handlerProxyMap = new Map();
}

ToggleZRImage.prototype = {
  constructor: ToggleZRImage,

  on(type, handler) {
    // 记录当前元素添加过的事件 用于图片切换之后把事件重新添加到新的元素上
    if (!this.handlerProxyMap.get(type)) {
      this.handlerProxyMap.set(type, []);
    }
    this.handlerProxyMap.get(type).push(handler);
  },

  off(type, handler) {
    const handlers = this.handlerProxyMap.get(type);
    if (!handlers || !handlers.length) return;
    const idx = handlers?.findIndex(d => d === handler);
    if (idx !== -1) {
      handlers.splice(idx, 1);
    }
  },

  toggleImage() {
    this.root.painter.zrRoot.remove(this.el);
    this.handlerProxyMap.forEach((handlers, type) => {
      handlers.forEach(handler => {
        BaseRect.prototype.off.call(this, type, handler);
      });
    });
    this.create();
    this.root.painter.zrRoot.add(this.el);
    this.handlerProxyMap.forEach((handlers, type) => {
      handlers.forEach(handler => {
        BaseRect.prototype.on.call(this, type, handler);
      });
    });
  }
};

export { ToggleZRImage };
