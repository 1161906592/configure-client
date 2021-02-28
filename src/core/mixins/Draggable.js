import { makeEventPacket } from "../Eventful";

function Draggable() {}

Draggable.prototype = {
  constructor: Draggable,

  dragOffsetX: 0,

  dragOffsetY: 0,

  addDrag() {
    const root = this.root;
    const mousedown = e => {
      e.event.stopPropagation();
      if (e.event.button !== 0) return;
      this.ondragstart([e.offsetX, e.offsetY]);

      const mousemove = e => {
        e = makeEventPacket(e);
        this.ondrag({ x: e.offsetX - this.dragOffsetX, y: e.offsetY - this.dragOffsetY });
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
  },

  // Interface
  ondragstart([x, y]) {
    this.dragOffsetX = x - this.x;
    this.dragOffsetY = y - this.y;
  },

  ondrag({ x, y }) {
    this.attr({ x, y });
  }
};

export { Draggable };
