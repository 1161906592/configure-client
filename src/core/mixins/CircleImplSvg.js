import { createSvgNode, fixZrCoordinate } from "../helpers";

function CircleImplSvg() {}

CircleImplSvg.prototype = {
  constructor: CircleImplSvg,

  create() {
    const el = (this.el = createSvgNode("g"));

    this.circleEl = createSvgNode("circle");
    this.circleEl.setAttribute("id", "aaa");

    el.appendChild(this.circleEl);

    this.mapToView();
  },

  mapToView() {
    this.toggleImage();

    const x = fixZrCoordinate(this.x);
    const y = fixZrCoordinate(this.y);

    this.circleEl.setAttribute("cx", x);
    this.circleEl.setAttribute("cy", y);
    this.circleEl.setAttribute("r", Math.abs(this.r));
    this.circleEl.setAttribute("fill", this.fill);
    this.circleEl.setAttribute("stroke-width", 1);
    this.circleEl.setAttribute("stroke", "rgb(0,0,0)");
    this.circleEl.style.cursor = "pointer";

    if (this.imageEl) {
      this.imageEl.setAttribute("x", x - this.r);
      this.imageEl.setAttribute("y", y - this.r);
      this.imageEl.setAttribute("width", Math.abs(2 * this.r));
      this.imageEl.setAttribute("height", Math.abs(2 * this.r));
    }

    if (this.clipCircle) {
      this.clipCircle.setAttribute("cx", x);
      this.clipCircle.setAttribute("cy", y);
      this.clipCircle.setAttribute("r", Math.abs(this.r));
    }
  },

  toggleImage() {
    if (this.hasImage !== !!this.image) {
      if (this.imageEl) {
        this.el.removeChild(this.imageEl);
      } else {
        const defs = createSvgNode("defs");
        this.el.insertBefore(defs, this.circleEl);
        this.clipPath = createSvgNode("clipPath");
        this.clipPath.setAttribute("id", `${this.id}-clipPath`);
        this.clipCircle = createSvgNode("circle");
        this.clipPath.appendChild(this.clipCircle);
        defs.appendChild(this.clipPath);

        this.imageEl = createSvgNode("image");
        this.imageEl.setAttribute("clip-path", `url(#${this.id}-clipPath)`);
        this.imageEl.setAttribute("preserveAspectRatio", "none");
        this.imageEl.setAttribute("href", this.image);
        this.el.insertBefore(this.imageEl, this.circleEl);
      }
    }
    this.hasImage = !!this.image;
  }
};

export { CircleImplSvg };
