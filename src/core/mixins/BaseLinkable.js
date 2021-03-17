import { makeEventPacket } from "../Eventful";

// 可以添加连接线的类的混入类的抽象类 用于表示其公共部分 只用于混入 不能继承 继承无效
function BaseLinkable() {
  this.lines = this.lines || [];
}

BaseLinkable.prototype = {
  constructor: BaseLinkable,

  addDrawLinkLine() {
    console.log(this);
    const root = this.root;

    const click = e => {
      e.event.stopPropagation();

      if (root.curDrawLine) {
        // 避免作用于正在画的线
        if (root.curDrawLine === this) return;
        clickToEnd.call(this, e);
      } else {
        // 鼠标移动绘制线段
        const mousemove = e => {
          this.lineDrawing(makeEventPacket(e));
        };

        const clickRoot = () => {
          root.isNewPoint = true;
        };
        root.el.addEventListener("click", clickRoot);

        // 键盘控制
        const drawKeyDown = e => {
          root.curDrawLine?.keyCtrlDrawing(e);
        };
        document.addEventListener("keydown", drawKeyDown);

        root.offCurDrawLine = () => {
          document.removeEventListener("mousemove", mousemove);
          document.removeEventListener("keydown", drawKeyDown);
          root.el.removeEventListener("click", clickRoot);
          root.offCurDrawLine = null;
          root.curDrawLine = null;
        };
        document.addEventListener("mousemove", mousemove);

        clickToStart.call(this, e);
      }
    };

    this.on("click", click);

    this.removeDrawLinkLine = () => {
      this.off("click", click);
    };
  },

  // Interface 开始画线 用于确定起始点
  makeLineStartPoint() {},

  // Interface 开始画线 用于生成对应实现类的实例
  makeLinkLine() {},

  // Interface 画线过程中
  lineDrawing() {},

  // Interface 结束画线时的逻辑
  makeLineEndPoint() {},

  updateLines() {
    this.lines.forEach(line => {
      const isFollowStart = line.startElement === this;
      const points = line.points;
      line.focusIndex = isFollowStart ? 0 : points.length - 1;

      const sin = isFollowStart ? line.startSin : line.endSin;
      const cos = isFollowStart ? line.startCos : line.endCos;

      line.updatePoint(line.focusIndex, this.makeLineVertexByAngle(sin, cos));
    });
  },

  // 通过与宿主元素的 sin cos关系得到在宿主元素上的交点 用于更新当前线的端点
  makeLineVertexByAngle() {},

  removeLine(line) {
    this.lines.splice(
      this.lines.findIndex(d => d === line),
      1
    );
  },

  clearLine() {
    while (this.lines.length) {
      this.lines[0].unmount();
    }
  }
};

// 开始画线
function clickToStart(e) {
  const { line, sin, cos } = this.makeLinkLine(e);

  if (this.makeBeforeBreakPoints) {
    line.points.push(...this.makeBeforeBreakPoints([e.offsetX, e.offsetY]));
    line.startElement = this.startElement;
    this.startElement.lines.push(line);
  } else {
    line.startElement = this;
    this.lines.push(line);
  }

  line.startSin = sin;
  line.startCos = cos;

  const root = this.root;

  line.mount(root);

  root.curDrawLine = line;

  root.isNewPoint = true;
}

// 结束画线
function clickToEnd() {
  const root = this.root;

  const line = root.curDrawLine;
  const [last2, last] = line.makeDirectionPoints();

  const endPoint = this.makeLineEndPoint(last2, last);

  if (!endPoint) return;

  root.offCurDrawLine();

  const { point, sin, cos } = endPoint;

  if (this.makeAfterBreakPoints) {
    line.points.pop();
    line.points.push(...this.makeAfterBreakPoints(last));
    line.endElement = this.endElement;
    this.endElement.lines.push(line);
  } else {
    line.endElement = this;
    this.lines.push(line);
  }

  const points = line.points;
  points[points.length - 1] = point;
  line.attr({
    points: points
  });

  line.endSin = sin;
  line.endCos = cos;
}

export { BaseLinkable };
