import { Circle as ZRCircle } from "zrender";
export function CircleImplZR() {}
CircleImplZR.prototype = {
  constructor: CircleImplZR,

  render() {
    this.el = new ZRCircle({
      shape: {
        cx: this.shape.x,
        cy: this.shape.y,
        r: this.shape.r
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

  setShape() {
    this.el.setShape({
      cx: this.shape.x,
      cy: this.shape.y,
      r: this.shape.r
    });
  }
};
