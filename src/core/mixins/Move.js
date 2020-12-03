export function Move() {}

Move.prototype = {
  constructor: Move,
  addMove() {
    const root = this.root;
    let prevEvent;
    const mousedown = e => {
      if (e.event.button !== 0) return;
      prevEvent = e;

      const mousemove = e => {
        const offset = {
          x: e.offsetX - prevEvent.offsetX,
          y: e.offsetY - prevEvent.offsetY
        };
        this.follow(offset);
        prevEvent = e;
      };

      const mouseup = () => {
        root.off("mousemove", mousemove);
        root.off("mouseup", mouseup);
      };

      root.on("mousemove", mousemove);
      root.on("mouseup", mouseup);
    };

    this.on("mousedown", mousedown);
    this.removeMove = () => {
      this.off("mousedown", mousedown);
    };
  }
};
