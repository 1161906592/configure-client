import { typeEnum } from "./enums";
import { platformEnum } from "./enums";
import { makeMap } from "./helpers";
import { ArrowSvg } from "./elements/impl/ArrowSvg";
import { RectSvg } from "./elements/impl/RectSvg";
import { VertexSvg } from "./elements/impl/VertexSvg";
import { CircleSvg } from "./elements/impl/CircleSvg";
import { LineSvg } from "./elements/impl/LineSvg";
import { PolylineSvg } from "./elements/impl/PolylineSvg";
import { TextSvg } from "./elements/impl/TextSvg";

const implList = [
  { type: typeEnum.rect, platform: platformEnum.svg, Constructor: RectSvg },
  { type: typeEnum.polyline, platform: platformEnum.svg, Constructor: PolylineSvg },
  { type: typeEnum.line, platform: platformEnum.svg, Constructor: LineSvg },
  { type: typeEnum.circle, platform: platformEnum.svg, Constructor: CircleSvg },
  { type: typeEnum.vertex, platform: platformEnum.svg, Constructor: VertexSvg },
  { type: typeEnum.arrow, platform: platformEnum.svg, Constructor: ArrowSvg },
  { type: typeEnum.text, platform: platformEnum.svg, Constructor: TextSvg }
];

const typeConstructorMap = makeMap(implList, (map, item) => {
  (map[item.type] || (map[item.type] = {}))[item.platform] = item;
});

export function structRender(root, structure) {
  structure.elements.forEach(item => {
    createElement(item).mount(root);
  });
  root.flushRectLineRelation();
}

export function createElement(opts) {
  const element = new typeConstructorMap[opts.type][opts.platform].Constructor(opts);
  opts.children?.forEach(opts => {
    element.addChild(createElement(opts));
  });
  return element;
}
