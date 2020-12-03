import { Line } from "..";

export function DrawLine() {
  this.drawLineable = true;
}

DrawLine.prototype = {
  constructor: DrawLine,
  addDrawLine() {
    const root = this.root;

    const click = e => {
      e.event.stopPropagation();

      // 鼠标移动绘制线段
      const mousemove = e => {
        const curDrawLine = root.curDrawLine;
        if (!curDrawLine) return;
        const points = curDrawLine.shape.points;
        if (root.isNewPoint) {
          root.isNewPoint = false;
          points.push([~~e.offsetX + 0.5, ~~e.offsetY + 0.5]);
        } else {
          const last = points[points.length - 2];
          curDrawLine.isVertical = Math.abs(e.offsetY - last[1]) > Math.abs(e.offsetX - last[0]);
          points[points.length - 1] = curDrawLine.isVertical ? [last[0], ~~e.offsetY + 0.5] : [~~e.offsetX + 0.5, last[1]];
        }
        curDrawLine.setShape({
          points
        });
      };

      const clickRoot = () => {
        root.isNewPoint = true;
      };
      if (root.curDrawLine) {
        clickToEnd(this);
        root.off("mousemove", mousemove);
        root.off("click", clickRoot);
      } else {
        clickToStart(e, this);
        root.on("mousemove", mousemove);
        root.on("click", clickRoot);
      }
    };

    this.on("click", click);

    this.removeDrawLine = () => {
      this.off("click", click);
    };
  }
};

// 开始画线
function clickToStart(e, rect) {
  const shape = rect.shape;
  const root = rect.root;
  root.curDrawLineStartRect = rect;

  const x = ~~e.offsetX + 0.5;
  const y = ~~e.offsetY + 0.5;
  const near = [
    {
      isRight: false,
      value: x - shape.x,
      point: [shape.x, y]
    },
    {
      isRight: true,
      value: shape.x + shape.width - x,
      point: [shape.x + shape.width, y]
    },
    {
      isBottom: false,
      value: y - shape.y,
      point: [x, shape.y]
    },
    {
      isBottom: true,
      value: shape.y + shape.height - y,
      point: [x, shape.y + shape.height]
    }
  ];
  const min = Math.min(...near.map(d => d.value));
  const nearInfo = near.find(d => d.value === min);
  const point = nearInfo.point;

  let line = new Line({
    shape: {
      points: [point]
    }
  });
  root.add(line);
  line.el.silent = true;

  root.curDrawLine = line;
  rect.lines.push({
    id: line.id,
    isStart: true,
    isBottom: nearInfo.isBottom,
    isRight: nearInfo.isRight
  });
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
  const shape = rect.shape;
  const points = curDrawLine.shape.points;
  const last = points[points.length - 2];
  let point;
  let isBottom = false;
  let isRight = false;
  let arrowDirection;
  if (curDrawLine.isVertical) {
    point = [last[0], shape.y];
    arrowDirection = "B";
    if (last[1] > shape.y) {
      isBottom = true;
      arrowDirection = "T";
      point[1] += shape.height;
    }
  } else {
    point = [shape.x, last[1]];
    arrowDirection = "R";
    if (last[0] > shape.x) {
      isRight = true;
      arrowDirection = "L";
      point[0] += shape.width;
    }
  }
  points[points.length - 1] = point;
  curDrawLine.setShape({
    points
  });
  rect.lines.push({
    id: curDrawLine.id,
    isStart: false,
    isBottom: isBottom,
    isRight: isRight
  });
  curDrawLine.direction = arrowDirection;
  curDrawLine.isStartVertical = points[0][1] !== points[1][1];
  curDrawLine.isEndVertical = curDrawLine.isVertical;
  curDrawLine.el.silent = false;

  root.curDrawLine = null;
}
