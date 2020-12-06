import { Circle as ZRCircle, Image as ZRImage } from "zrender";

function CircleImplZR() {}

CircleImplZR.prototype = {
  constructor: CircleImplZR,

  create() {
    const circle = new ZRCircle({
      shape: makeCircleShape(this),
      style: {
        lineWidth: 1,
        stroke: "#000",
        text: "",
        fontSize: 16,
        textFill: "#999",
        fill: this.fill
      }
    });

    this.el = this.image
      ? new ZRImage({
          style: makeImageStyle(this)
        })
      : circle;

    if (this.image) {
      this.el.clipPath = circle;
      this.el.setClipPath(circle);
    }

    this.hasImage = !!this.image;
  },

  update() {
    if (this.hasImage !== !!this.image) {
      this.toggleImage();
      this.hasImage = true;
      return;
    }

    const circle = this.image ? this.el.clipPath : this.el;

    circle.setShape(makeCircleShape(this));

    if (this.image) {
      this.image && this.el.setStyle(makeImageStyle(this));
    }
  }
};

function makeCircleShape(circle) {
  return {
    cx: circle.x + 0.5,
    cy: circle.y + 0.5,
    r: circle.r
  };
}

function makeImageStyle(circle) {
  return {
    x: circle.x - circle.r,
    y: circle.y - circle.r,
    width: circle.r * 2,
    height: circle.r * 2,
    image: circle.image
  };
}

export { CircleImplZR };
