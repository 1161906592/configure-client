import { eachObj } from "../helpers";

function CircleImplDOM() {}
CircleImplDOM.prototype = {
  constructor: CircleImplDOM,

  create() {
    const div = document.createElement("div");

    eachObj(
      {
        position: "absolute",
        left: "0px",
        top: "0px",
        "box-sizing": "border-box",
        "border-radius": "50%",
        cursor: "pointer",
        border: "1px solid #000"
      },
      (value, key) => {
        div.style[key] = value;
      }
    );

    div.style.transform = `translate3d(${this.x - this.r}px, ${this.y - this.r}px, 0)`;
    const r = fixCircleRadius(this) + "px";
    div.style.width = r;
    div.style.height = r;

    div.style.background = this.fill;
    this.el = div;
  },

  update() {
    const r = fixCircleRadius(this) + "px";
    this.el.style.transform = `translate3d(${this.x - this.r}px, ${this.y - this.r}px, 0)`;
    this.el.style.width = r;
    this.el.style.height = r;
  }
};

function fixCircleRadius(circle) {
  return circle.r * 2 + circle.borderWidth / 2;
}

export { CircleImplDOM };
