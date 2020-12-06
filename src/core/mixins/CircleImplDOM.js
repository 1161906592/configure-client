function CircleImplDOM() {}
CircleImplDOM.prototype = {
  constructor: CircleImplDOM,

  create() {
    const el = document.createElement("div");

    el.style.cssText =
      [
        "position: absolute",
        "left: 0px",
        "top: 0px",
        "box-sizing: border-box",
        "border-radius: 50%",
        "cursor: pointer",
        "border: 1px solid #000",
        "text-align: center"
      ].join(";") + ";";

    this.el = el;

    renderProp.call(this);
  },

  update() {
    renderProp.call(this);
  }
};

function renderProp() {
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

function fixCircleRadius(circle) {
  return circle.r * 2 + circle.borderWidth / 2;
}

export { CircleImplDOM };
