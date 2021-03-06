import { fieldTypeEnum, platformEnum, typeEnum } from "./enums";
import { makeMap } from "./helpers";

const elementBaseItems = [
  { prop: "x", label: "x坐标", type: fieldTypeEnum.number },
  { prop: "y", label: "y坐标", type: fieldTypeEnum.number }
];

const rectBaseItems = [
  ...elementBaseItems,
  { prop: "width", label: "宽度", type: fieldTypeEnum.number },
  { prop: "height", label: "高度", type: fieldTypeEnum.number },
  { prop: "zIndex", label: "层级", type: fieldTypeEnum.number },
  { prop: "image", label: "背景图片", type: fieldTypeEnum.text }
];

const circleBaseItems = [
  ...elementBaseItems,
  { prop: "r", label: "半径", type: fieldTypeEnum.number },
  { prop: "image", label: "背景图片", type: fieldTypeEnum.text }
];

const lineBaseItems = [
  {
    prop: "useArrow",
    label: "箭头",
    type: fieldTypeEnum.select,
    options: [
      { label: "是", value: true },
      { label: "否", value: false }
    ]
  }
];

const textBaseItems = [...elementBaseItems, { prop: "text", label: "文字", type: fieldTypeEnum.text }];

const configurableList = [
  {
    type: typeEnum.rect,
    platform: platformEnum.svg,
    items: [...rectBaseItems]
  },
  {
    type: typeEnum.polyline,
    platform: platformEnum.svg,
    items: [...lineBaseItems]
  },
  {
    type: typeEnum.line,
    platform: platformEnum.svg,
    items: [...lineBaseItems]
  },
  {
    type: typeEnum.circle,
    platform: platformEnum.svg,
    items: [...circleBaseItems]
  },
  {
    type: typeEnum.text,
    platform: platformEnum.svg,
    items: [...textBaseItems]
  }
];

export const configurableMap = Object.freeze(
  makeMap(configurableList, (map, item) => {
    (map[item.type] || (map[item.type] = {}))[item.platform] = Object.freeze(item);
  })
);

export function makeConfiguration(items) {
  return makeMap(items, (map, item) => {
    let value = item.value;
    if (item.type === fieldTypeEnum.number) {
      value = Number(value);
    }
    map[item.prop] = value;
  });
}
