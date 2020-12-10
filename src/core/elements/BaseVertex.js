import { Element } from "../Element";
import { typeEnum } from "../enums";
import { extend, mixin } from "../helpers";
import { Draggable } from "../mixins/Draggable";

function BaseVertex(opts) {
  Element.call(this, opts);
  Draggable.call(this, opts);
}

BaseVertex.prototype = {
  constructor: BaseVertex,

  type: typeEnum.vertex,

  r: 4,

  borderWidth: 1,

  fill: "#fff",

  hasImage: false,

  isUpdateByResize: false,

  update() {
    Element.prototype.update.call(this);
    this.isUpdateByResize = false;
    this.parent.syncWidthVertex(this);
  },

  export() {}
};

extend(BaseVertex, Element);
mixin(BaseVertex, Draggable);

export { BaseVertex };
