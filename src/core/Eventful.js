import { platformEnum } from "./enums";

function Eventful() {
  if (this.platform === platformEnum.dom || this.platform === platformEnum.svg) {
    this.handlerMap = new Map();
  }
}

Eventful.prototype = {
  constructor: Eventful,

  on(type, handler) {
    switch (this.platform) {
      case platformEnum.dom:
        onDOM.call(this, type, handler);
        break;
      case platformEnum.svg:
        onDOM.call(this, type, handler);
        break;
      case platformEnum.zr:
        onZR.call(this, type, handler);
        break;
    }
  },

  off(type, handler) {
    switch (this.platform) {
      case platformEnum.dom:
        offDOM.call(this, type, handler);
        break;
      case platformEnum.svg:
        offDOM.call(this, type, handler);
        break;
      case platformEnum.zr:
        offZR.call(this, type, handler);
        break;
    }
  }
};

function onDOM(type, handler) {
  const wrappedHandler = event => {
    handler(makeEventPacket(event));
  };
  this.handlerMap.set(handler, wrappedHandler);
  this.el.addEventListener(type, wrappedHandler);
}

function offDOM(type, handler) {
  const wrappedHandler = this.handlerMap.get(handler);
  this.el.removeEventListener(type, wrappedHandler);
}

function onZR(type, handler) {
  this.el.on(type, handler);
}

function offZR(type, handler) {
  this.el.off(type, handler);
}

export function makeEventPacket(event) {
  return {
    offsetX: event.layerX,
    offsetY: event.layerY,
    event
  };
}

export { Eventful };
