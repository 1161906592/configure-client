import { eachObj } from "../helpers";

function CircleImplDOM() {}
CircleImplDOM.prototype = {
  constructor: CircleImplDOM,

  create() {
    const el = document.createElement("div");

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
        el.style[key] = value;
      }
    );

    el.style.transform = `translate3d(${this.x - this.r}px, ${this.y - this.r}px, 0)`;
    const r = fixCircleRadius(this) + "px";
    el.style.width = r;
    el.style.height = r;

    if (this.fill) {
      el.style.background = this.fill;
    }

    if (this.image) {
      el.style.background = `url(${this.image}) center/100% 100%`;
    }

    this.el = el;
  },

  update() {
    const r = fixCircleRadius(this) + "px";
    const el = this.el;

    el.style.transform = `translate3d(${this.x - this.r}px, ${this.y - this.r}px, 0)`;
    el.style.width = r;
    el.style.height = r;

    if (this.fill) {
      el.style.background = this.fill;
    }

    if (this.image) {
      el.style.background = `url(${this.image}) center/100% 100%`;
    }
  }
};

function fixCircleRadius(circle) {
  return circle.r * 2 + circle.borderWidth / 2;
}

export { CircleImplDOM };
