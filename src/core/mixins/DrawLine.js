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
        clickToEnd.call(this);
      } else {
        // 鼠标移动绘制线段
        const mousemove = e => {
          this.lineDrawing(makeEventPacket(e));
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
        clickToStart.call(this, e);
      }
    };

    this.on("click", click);

    this.removeDrawLine = () => {
      this.off("click", click);
    };
  },

  // Interface 开始画线 用于确定起始点
  makeDrawingLine() {},

  // Interface 画线过程中
  lineDrawing() {},

  // Interface 结束画线时的逻辑
  makeDrawingLineEndPoint() {},

  clearLine() {
    while (this.lines.length) {
      this.root.remove(this.lines[0].line);
    }
  },

  removeLine(line) {
    this.lines.splice(
      this.lines.findIndex(d => d.line === line),
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
function clickToStart(e) {
  const line = this.makeDrawingLine(e);

  const root = this.root;
  root.curDrawLineStartElement = this;

  line.el.silent = true;

  line.startElement = this;

  root.add(line);

  root.curDrawLine = line;

  root.isNewPoint = true;
}

// 结束画线
function clickToEnd() {
  const root = this.root;
  if (root.curDrawLineStartElement === this) {
    // root.remove(root.curDrawLine);
    // root.curDrawLine
  }
  const line = root.curDrawLine;
  const points = line.points;

  points[points.length - 1] = this.makeDrawingLineEndPoint();
  line.update();
  line.endElement = this;
  line.el.silent = false;
  root.curDrawLine = null;
}

export { DrawLine };
