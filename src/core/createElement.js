import { Line } from "./elements/Line";
import { RectDOM } from "./elements/dom/RectDOM";
import { RectZR } from "./elements/zr/RectZR";
import { typeEnum } from "./Element";
import { platformEnum } from "./platform";
import { makeMap } from "./helpers";
import { CircleDOM } from "./elements/dom/CircleDOM";
import { CircleZR } from "./elements/zr/CircleZR";
import { VertexDOM } from "./elements/dom/VertexDOM";
import { VertexZR } from "./elements/zr/VertexZR";

const implList = [
  { type: typeEnum.rect, platform: platformEnum.dom, Constructor: RectDOM },
  { type: typeEnum.rect, platform: platformEnum.zr, Constructor: RectZR },
  { type: typeEnum.line, platform: platformEnum.zr, Constructor: Line },
  { type: typeEnum.circle, platform: platformEnum.dom, Constructor: CircleDOM },
  { type: typeEnum.circle, platform: platformEnum.zr, Constructor: CircleZR },
  { type: typeEnum.vertex, platform: platformEnum.dom, Constructor: VertexDOM },
  { type: typeEnum.vertex, platform: platformEnum.zr, Constructor: VertexZR }
];

const typeConstructorMap = makeMap(implList, (map, item) => {
  (map[item.type] || (map[item.type] = {}))[item.platform] = item;
});

export function structRender(root, structures) {
  structures.forEach(item => {
    const element = createElement(item);
    root.add(element);
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
