import { Element } from "../../Element";
import { extend } from "../../helpers";
import { Text as ZRText } from "zrender";
import { platformEnum, typeEnum } from "../../enums";

function Text(opts) {
  Element.call(this, opts);
}

Text.prototype = {
  constructor: Text,

  type: typeEnum.text,

  platform: platformEnum.svg,

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

export { Text };
