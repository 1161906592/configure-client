import { Circle as ZRCircle } from "zrender";
function CircleImplZR() {}
CircleImplZR.prototype = {
  constructor: CircleImplZR,

  create() {
    this.el = new ZRCircle({
      shape: {
        cx: this.x + 0.5,
        cy: this.y + 0.5,
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
      cx: this.x + 0.5,
      cy: this.y + 0.5,
      r: this.r
    });
  }
};

export { CircleImplZR };
