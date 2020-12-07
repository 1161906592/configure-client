import { makeEventPacket } from "../Eventful";

function Draggable() {}

Draggable.prototype = {
  constructor: Draggable,

  eventOffsetX: 0,

  eventOffsetY: 0,

  addDrag() {
    const root = this.root;
    const mousedown = e => {
      if (e.event.button !== 0) return;

      this.eventOffsetX = e.offsetX - this.x;
      this.eventOffsetY = e.offsetY - this.y;

      const mousemove = e => {
        e = makeEventPacket(e);
        this.attr({
          x: e.offsetX - this.eventOffsetX,
          y: e.offsetY - this.eventOffsetY
        });
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
