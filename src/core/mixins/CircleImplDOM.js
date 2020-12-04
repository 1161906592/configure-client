import { eachObj } from "../helpers";

export function CircleImplDOM() {}
CircleImplDOM.prototype = {
  constructor: CircleImplDOM,

  render() {
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
    div.style.width = `${this.r * 2}px`;
    div.style.height = `${this.r * 2}px`;

    div.style.background = this.fill;
    this.el = div;
  },

  dirty() {
    this.el.style.transform = `translate3d(${this.x - this.r}px, ${this.y - this.r}px, 0)`;
    this.el.style.width = `${this.r * 2}px`;
    this.el.style.height = `${this.r * 2}px`;
  }
};
