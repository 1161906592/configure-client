import { fieldTypeEnum, platformEnum, typeEnum } from "./enums";
import { makeMap } from "./helpers";

const rectBaseItems = [
  { prop: "x", label: "x坐标", type: fieldTypeEnum.number },
  { prop: "y", label: "y坐标", type: fieldTypeEnum.number },
  { prop: "width", label: "宽度", type: fieldTypeEnum.number },
  { prop: "height", label: "高度", type: fieldTypeEnum.number },
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

const configurableList = [
  {
    type: typeEnum.rect,
    platform: platformEnum.dom,
    items: [...rectBaseItems]
  },
  {
    type: typeEnum.rect,
    platform: platformEnum.zr,
    items: [...rectBaseItems]
  },
  {
    type: typeEnum.line,
    platform: platformEnum.dom,
    items: [...lineBaseItems]
  },
  {
    type: typeEnum.line,
    platform: platformEnum.zr,
    items: [...lineBaseItems]
  }
];

export const configurableMap = Object.freeze(
  makeMap(configurableList, (map, item) => {
    (map[item.type] || (map[item.type] = {}))[item.platform] = Object.freeze(item);
  })
);
