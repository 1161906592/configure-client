import { Circle as ZRCircle } from "zrender";
function CircleImplZR() {}
CircleImplZR.prototype = {
  constructor: CircleImplZR,

  create() {
    this.el = new ZRCircle({
      shape: {
        cx: this.x,
        cy: this.y,
        r: this.r
      },
      style: {
        lineWidth: 1,
        stroke: "#000",
        text: "",
        fontSize: 16,
        textFill: "#999",
        fill: this.fill
      }
    });
  },

  update() {
    this.el.setShape({
      cx: this.x,
      cy: this.y,
      r: this.r
    });
  }
};

export { CircleImplZR };
