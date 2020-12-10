import { platformEnum } from "./enums";
import { createSvgNode } from "./helpers";

function Painter(root) {
  const svg = createSvgNode("svg");

  root.appendChild(svg);

  svg.setAttribute("width", root.clientWidth);
  svg.setAttribute("height", root.clientHeight);

  svg.style.cssText = "position: absolute;left: 0;top:0;";

  this.svgRoot = svg;
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
      case platformEnum.svg:
        this.svgRoot.appendChild(element.el);
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
      case platformEnum.svg:
        this.svgRoot.removeChild(element.el);
        break;
    }
  }
};

export { Painter };
