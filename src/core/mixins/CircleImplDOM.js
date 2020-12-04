export function CircleImplDOM() {}
CircleImplDOM.prototype = {
  constructor: CircleImplDOM,

  render() {
    const div = document.createElement("div");
    const shape = this.shape;
    const style = {
      position: "absolute",
      left: "0px",
      top: "0px",
      "box-sizing": "border-box",
      "border-radius": "50%",
      cursor: "pointer",
      border: "1px solid #000"
    };
    div.style.cssText =
      `transform: translate3d(${shape.x - shape.r}px, ${shape.y - shape.r}px, 0);width: ${shape.r * 2}px;height: ${shape.r * 2}px;` +
      Object.keys(style)
        .map(key => {
          return key + ":" + style[key] + ";";
        })
        .join("");
    div.style.background = this.fill;
    this.el = div;
  },

  setShape(shape) {
    this.el.style.transform = `translate3d(${this.shape.x - this.shape.r}px, ${this.shape.y - this.shape.r}px, 0)`;
    this.el.style.width = `${shape.r * 2}px`;
    this.el.style.height = `${shape.r * 2}px`;
  }
};
