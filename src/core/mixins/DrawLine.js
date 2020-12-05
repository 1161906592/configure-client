import { Line } from "..";
import { makeEventPacket } from "../Eventful";

function DrawLine() {
  this.lines = this.lines || [];
}

DrawLine.prototype = {
  constructor: DrawLine,

  addDrawLine() {
    const root = this.root;

    const click = e => {
      e.event.stopPropagation();

      if (root.curDrawLine) {
        root.offCurDrawLine();
        clickToEnd(this);
      } else {
        // 鼠标移动绘制线段
        const mousemove = e => {
          e = makeEventPacket(e);
          const curDrawLine = root.curDrawLine;
          if (!curDrawLine) return;
          const points = curDrawLine.points;
          if (root.isNewPoint) {
            root.isNewPoint = false;
            points.push([~~e.offsetX + 0.5, ~~e.offsetY + 0.5]);
          } else {
            const last = points[points.length - 2];
            root.isCurLineVertical = Math.abs(e.offsetY - last[1]) > Math.abs(e.offsetX - last[0]);
            points[points.length - 1] = root.isCurLineVertical ? [last[0], ~~e.offsetY + 0.5] : [~~e.offsetX + 0.5, last[1]];
          }
          curDrawLine.update();
        };

        const clickRoot = () => {
          root.isNewPoint = true;
        };

        root.offCurDrawLine = () => {
          root.el.removeEventListener("mousemove", mousemove);
          root.el.removeEventListener("click", clickRoot);
        };
        root.el.addEventListener("mousemove", mousemove);
        root.el.addEventListener("click", clickRoot);
        clickToStart(e, this);
      }
    };

    this.on("click", click);

    this.removeDrawLine = () => {
      this.off("click", click);
    };
  },

  clearLine() {
    this.lines.forEach(item => {
      this.root.remove(item.line);
    });
    this.lines = [];
  },

  removeLine(line) {
    this.lines.splice(
      this.lines.findIndex(d => d.id === line.id),
      1
    );
  },

  exportStruct() {
    return this.lines.map(item => {
      return {
        id: item.id,
        isStart: item.isStart,
        isBottom: item.isBottom,
        isRight: item.isRight
      };
    });
  }
};

// 开始画线
function clickToStart(e, rect) {
  const root = rect.root;
  root.curDrawLineStartRect = rect;

  const x = ~~e.offsetX + 0.5;
  const y = ~~e.offsetY + 0.5;
  const near = [
    {
      isRight: false,
      value: x - rect.x,
      point: [rect.x, y]
    },
    {
      isRight: true,
      value: rect.x + rect.width - x,
      point: [rect.x + rect.width, y]
    },
    {
      isBottom: false,
      value: y - rect.y,
      point: [x, rect.y]
    },
    {
      isBottom: true,
      value: rect.y + rect.height - y,
      point: [x, rect.y + rect.height]
    }
  ];
  const min = Math.min(...near.map(d => d.value));
  const nearInfo = near.find(d => d.value === min);
  const point = nearInfo.point;

  let curDrawLine = new Line({
    points: [point]
  });
  root.add(curDrawLine);
  curDrawLine.el.silent = true;

  root.curDrawLine = curDrawLine;
  rect.lines.push({
    id: curDrawLine.id,
    isStart: true,
    isBottom: nearInfo.isBottom,
    isRight: nearInfo.isRight,
    line: curDrawLine
  });
  curDrawLine.startRect = rect;
  root.isNewPoint = true;
}

// 结束画线
function clickToEnd(rect) {
  const root = rect.root;
  if (root.curDrawLineStartRect === rect) {
    // root.remove(root.curDrawLine);
    // root.curDrawLine
  }
  const curDrawLine = root.curDrawLine;
  const points = curDrawLine.points;
  const last = points[points.length - 2];
  let point;
  let isBottom = false;
  let isRight = false;
  let arrowDirection;
  if (root.isCurLineVertical) {
    point = [last[0], rect.y];
    arrowDirection = "B";
    if (last[1] > rect.y) {
      isBottom = true;
      arrowDirection = "T";
      point[1] += rect.height;
    }
  } else {
    point = [rect.x, last[1]];
    arrowDirection = "R";
    if (last[0] > rect.x) {
      isRight = true;
      arrowDirection = "L";
      point[0] += rect.width;
    }
  }
  points[points.length - 1] = point;
  curDrawLine.update();
  rect.lines.push({
    id: curDrawLine.id,
    isStart: false,
    isBottom: isBottom,
    isRight: isRight,
    line: curDrawLine
  });
  curDrawLine.endRect = rect;
  curDrawLine.direction = arrowDirection;
  curDrawLine.isStartVertical = points[0][1] !== points[1][1];
  curDrawLine.isEndVertical = root.isCurLineVertical;
  curDrawLine.el.silent = false;

  curDrawLine.addArrow();

  root.curDrawLine = null;
}

export { DrawLine };
