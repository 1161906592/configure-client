import { platformEnum } from "./enums";
import { init } from "zrender";

function Painter(root) {
  root.style.position = "relative";
  root.style.overflow = "hidden";

  this.domRoot = root;

  this.zrRoot = init(root);
}

Painter.prototype = {
  constructor: Painter,

  add(element) {
    switch (element.platform) {
      case platformEnum.dom:
        this.domRoot.appendChild(element.el);
        break;
      case platformEnum.zr:
        this.zrRoot.add(element.el);
        break;
    }
  },

  remove(element) {
    switch (element.platform) {
      case platformEnum.dom:
        this.domRoot.removeChild(element.el);
        break;
      case platformEnum.zr:
        this.zrRoot.remove(element.el);
        break;
    }
  }
};

export { Painter };
