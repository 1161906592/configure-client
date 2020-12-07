import { Element } from "../Element";
import { extend, mixin } from "../helpers";
import { Text as ZRText } from "zrender";
import { platformEnum, typeEnum } from "../enums";
import { Draggable } from "../mixins/Draggable";

function Text(opts) {
  Element.call(this, opts);
  Draggable.call(this, opts);
}

Text.prototype = {
  constructor: Text,

  type: typeEnum.text,

  platform: platformEnum.zr,

  text: "文字",

  create() {
    this.el = new ZRText({
      style: {
        x: this.x,
        y: this.y,
        text: this.text
      }
    });
  },

  mapToView() {
    this.el.setStyle({
      x: this.x,
      y: this.y,
      text: this.text
    });
  },

  export() {
    return {
      ...Element.prototype.export.call(this),
      text: this.text
    };
  }
};

extend(Text, Element);
mixin(Text, Draggable);

export { Text };
