export function EventFulDOM() {
  this.eventFns = [];
  this.eventWrapperFns = [];
}

EventFulDOM.prototype = {
  constructor: EventFulDOM,
  on(type, fn) {
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
  },

  off(type, fn) {
    const idx = this.eventFns.findIndex(d => d === fn);
    if (idx !== -1) {
      const wrapperFn = this.eventWrapperFns[idx];
      this.eventFns.splice(idx, 1);
      this.eventWrapperFns.splice(idx, 1);
      this.el.removeEventListener(type, wrapperFn);
    }
  }
};
