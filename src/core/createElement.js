import { typeEnum } from "./enums";
import { platformEnum } from "./enums";
import { makeMap } from "./helpers";
import { RectDOM } from "./elements/dom/RectDOM";
import { RectZR } from "./elements/zr/RectZR";
import { Polyline } from "./elements/Polyline";
import { Line } from "./elements/Line";
import { CircleDOM } from "./elements/dom/CircleDOM";
import { CircleZR } from "./elements/zr/CircleZR";
import { VertexDOM } from "./elements/dom/VertexDOM";
import { VertexZR } from "./elements/zr/VertexZR";
import { Arrow } from "./elements/Arrow";
import { Text } from "./elements/Text";

const implList = [
  { type: typeEnum.rect, platform: platformEnum.dom, Constructor: RectDOM },
  { type: typeEnum.rect, platform: platformEnum.zr, Constructor: RectZR },
  { type: typeEnum.polyline, platform: platformEnum.zr, Constructor: Polyline },
  { type: typeEnum.line, platform: platformEnum.zr, Constructor: Line },
  { type: typeEnum.circle, platform: platformEnum.dom, Constructor: CircleDOM },
  { type: typeEnum.circle, platform: platformEnum.zr, Constructor: CircleZR },
  { type: typeEnum.vertex, platform: platformEnum.dom, Constructor: VertexDOM },
  { type: typeEnum.vertex, platform: platformEnum.zr, Constructor: VertexZR },
  { type: typeEnum.arrow, platform: platformEnum.zr, Constructor: Arrow },
  { type: typeEnum.text, platform: platformEnum.zr, Constructor: Text }
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
