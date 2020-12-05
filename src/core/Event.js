import { platformEnum } from "./platform";

function Event() {
  if (this.platform === platformEnum.dom) {
    this.eventPool = new Map();
  }
}

Event.prototype = {
  constructor: Event,

  on(type, fn) {
    switch (this.platform) {
      case platformEnum.dom:
        onDOM.call(this, type, fn);
        break;
      case platformEnum.zr:
        onZR.call(this, type, fn);
        break;
    }
  },

  off(type, fn) {
    switch (this.platform) {
      case platformEnum.dom:
        offDOM.call(this, type, fn);
        break;
      case platformEnum.zr:
        offZR.call(this, type, fn);
        break;
    }
  }
};

function onDOM(type, fn) {
  const wrapperFn = event => {
    fn(makeEventPacket(event));
  };
  this.eventPool.set(fn, wrapperFn);
  this.el.addEventListener(type, wrapperFn);
}

function offDOM(type, fn) {
  const wrapperFn = this.eventPool.get(fn);
  this.el.removeEventListener(type, wrapperFn);
}

function onZR(type, fn) {
  this.el.on(type, fn);
}

function offZR(type, fn) {
  this.el.off(type, fn);
}

function makeEventPacket(event) {
  return {
    offsetX: event.layerX,
    offsetY: event.layerY,
    event
  };
}

export { Event };
