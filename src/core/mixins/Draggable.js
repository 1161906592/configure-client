import { makeEventPacket } from "../Eventful";

function Draggable() {}

Draggable.prototype = {
  constructor: Draggable,

  addMove() {
    const root = this.root;
    let prevEvent;
    const mousedown = e => {
      if (e.event.button !== 0) return;
      prevEvent = e;

      const mousemove = e => {
        e = makeEventPacket(e);
        const offset = {
          x: e.offsetX - prevEvent.offsetX,
          y: e.offsetY - prevEvent.offsetY
        };
        this.follow(offset);
        prevEvent = e;
      };

      const mouseup = () => {
        root.el.removeEventListener("mousemove", mousemove);
        root.el.removeEventListener("mouseup", mouseup);
      };

      root.el.addEventListener("mousemove", mousemove);
      root.el.addEventListener("mouseup", mouseup);
    };
    this.on("mousedown", mousedown);
    this.removeMove = () => {
      this.off("mousedown", mousedown);
    };
  }
};

export { Draggable };
