export const platformEnum = {
  dom: "dom",
  zr: "zr"
};

export function Event() {}

Event.prototype = {
  constructor: Event,
  initEvent() {
    if (this.platform === platformEnum.dom) {
      this.eventFns = [];
      this.eventWrapperFns = [];
    }
  },

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
    const offset = this.root.offset;
    fn({
      offsetX: event.clientX - offset.left,
      offsetY: event.clientY - offset.top,
      event
    });
  };
  this.eventFns.push(fn);
  this.eventWrapperFns.push(wrapperFn);
  this.el.addEventListener(type, wrapperFn);
}

function offDOM(type, fn) {
  const idx = this.eventFns.findIndex(d => d === fn);
  if (idx !== -1) {
    const wrapperFn = this.eventWrapperFns[idx];
    this.eventFns.splice(idx, 1);
    this.eventWrapperFns.splice(idx, 1);
    this.el.removeEventListener(type, wrapperFn);
  }
}

function onZR(type, fn) {
  this.el.on(type, fn);
}

function offZR(type, fn) {
  this.el.off(type, fn);
}
