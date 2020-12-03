import { Element, typeEnum } from "../Element";
import { Polyline } from "zrender";
import { lineAutoBreak, lineVertexFollow, lineVertexNextFollow } from "../handler/rectMove";
import { platformEnum } from "../Event";
import { extend } from "../helpers";

export function Line(opts) {
  opts.platform = platformEnum.zr;
  Element.call(this, opts);
  this.type = typeEnum.line;
  this.shape = {
    points: [[0, 0]],
    ...this.shape
  };
  this.style = {
    lineWidth: 1,
    stroke: "#000",
    text: "",
    fontSize: 16,
    textFill: "#999",
    ...this.style
  };
}

Line.prototype = {
  constructor: Line,

  render() {
    this.el = new Polyline({
      shape: this.shape,
      style: this.style
    });
  },

  mount(root) {
    Element.prototype.mount.call(this, root);
    root.zr.add(this.el);
  },

  unmount(root) {
    Element.prototype.unmount.call(this, root);
    root.zr.remove(this.el);
  },

  setShape(shape) {
    Element.prototype.setShape.call(this, shape);
    this.el.setShape(this.shape);
  },

  follow(offset) {
    console.log(offset);
    // super.follow(offset);
  },

  followHost(offset) {
    const points = this.shape.points;

    lineVertexFollow(this, offset);

    if (points.length > 2) {
      lineVertexNextFollow(this);
    } else {
      lineAutoBreak(this);
    }

    this.setShape({
      points: points
    });
  }
};

extend(Line, Element);
