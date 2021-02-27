import { Element } from "../Element";
import { typeEnum } from "../enums";
import { extend } from "../helpers";

function BaseVertex(opts) {
  Element.call(this, opts);
}

BaseVertex.prototype = {
  constructor: BaseVertex,

  type: typeEnum.vertex,

  r: 4,

  borderWidth: 1,

  fill: "#fff",

  hasImage: false,

  index: 0,

  update() {
    Element.prototype.update.call(this);
    this.parent.syncWidthVertex(this);
  },

  ondragstart() {
    this.parent.focusIndex = this.index;
  },

  export() {}
};

extend(BaseVertex, Element);

export { BaseVertex };
