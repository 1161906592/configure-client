import { platformEnum } from "./enums";
import { createSvgNode } from "./helpers";

function Painter(root) {
  const svg = createSvgNode("svg");

  root.appendChild(svg);

  svg.setAttribute("width", root.clientWidth);
  svg.setAttribute("height", root.clientHeight);

  svg.style.cssText = "position: absolute;left: 0;top:0;";

  this.svgRoot = svg;

  this.svgZIndexMap = {};
  this.svgZIndex = [];
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
        if (!this.svgZIndexMap[element.zIndex]) {
          const g = createSvgNode("g");
          g.setAttribute("z-index", element.zIndex);
          this.svgZIndexMap[element.zIndex] = g;
          let preZIndex = this.svgZIndex.find(d => d < element.zIndex);
          if (!preZIndex) {
            preZIndex = this.svgZIndex[0];
          }
          this.svgRoot.insertBefore(g, this.svgZIndexMap[preZIndex]);
          this.svgZIndex.push(element.zIndex);
          this.svgZIndex.sort();
        }
        this.svgZIndexMap[element.zIndex].appendChild(element.el);
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
        this.svgZIndexMap[element.zIndex].removeChild(element.el);
        break;
    }
  }
};

export { Painter };
