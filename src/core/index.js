import { Root } from "./Root";
import { Line } from "./elements/Line";
import { RectDOM } from "./elements/dom/RectDOM";
import { RectZR } from "./elements/zr/RectZR";
import { typeEnum } from "./Element";
import { platformEnum } from "./Event";
import { makeMap } from "./helpers";
import { CircleDOM } from "./elements/dom/CircleDOM";
import { CircleZR } from "./elements/zr/CircleZR";

const implList = [
  { type: typeEnum.rect, platform: platformEnum.dom, Constructor: RectDOM },
  { type: typeEnum.rect, platform: platformEnum.zr, Constructor: RectZR },
  { type: typeEnum.line, platform: platformEnum.zr, Constructor: Line },
  { type: typeEnum.circle, platform: platformEnum.dom, Constructor: CircleDOM },
  { type: typeEnum.circle, platform: platformEnum.zr, Constructor: CircleZR }
];

const typeConstructorMap = makeMap(implList, (map, item) => {
  (map[item.type] || (map[item.type] = {}))[item.platform] = item;
});

export function createElement(opts) {
  const element = new typeConstructorMap[opts.type][opts.platform].Constructor(opts);
  opts.children?.forEach(opts => {
    element.addChild(createElement(opts));
  });
  return element;
}

export { Root, Line, RectDOM, RectZR, typeEnum, platformEnum, typeConstructorMap };
