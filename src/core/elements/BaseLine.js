import { typeEnum } from "../enums";
import { BaseLinkLine } from "./BaseLinkLine";
import { extend, handleKeyEvent } from "../helpers";

function BaseLine(opts) {
  BaseLinkLine.call(this, opts);
}

BaseLine.prototype = {
  constructor: BaseLine,

  type: typeEnum.line,

  points: [
    [0, 0],
    [0, 0]
  ],

  color: "#000",

  useArrow: false,

  // updateByKeydown(e) {
  //   console.log("updateByKeydown", e);
  //   BaseLinkLine.prototype.updateByKeydown.call(this, e);
  // },

  updateByKeydown(e) {
    updateByKeydown.call(this, e);
  },

  export() {
    return {
      ...BaseLinkLine.prototype.export.call(this)
    };
  }
};

extend(BaseLine, BaseLinkLine);

function updateByKeydown(e) {
  handleKeyEvent(e, {
    b: {
      handler: () => {
        breakSection.call(this, this.focusIndex);
        // 如果有focusPoint, 根据focusPoint调整 focusIndex 的值
        this.focusPoint(this.curFocusPoint);
      },
      modifiers: {
        ctrl: true
      }
    }
  });
}

// 折断线段的某一小段
function breakSection(index) {
  const points = this.points;
  const curIndex = index === points.length - 1 ? index - 1 : index;
  const halfX = (points[curIndex][0] + points[curIndex + 1][0]) / 2;
  const halfY = (points[curIndex][1] + points[curIndex + 1][1]) / 2;
  this.insertPoints(curIndex + 1, [halfX, halfY]);
}

export { BaseLine };
