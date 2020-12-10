import { makeEventPacket } from "../Eventful";

// 可以添加连接线的类的混入类的抽象类 用于表示其公共部分 只用于混入 不能继承 继承无效
function BaseLinkable() {
  this.lines = this.lines || [];
}

BaseLinkable.prototype = {
  constructor: BaseLinkable,

  addDrawLinkLine() {
    const root = this.root;

    const click = e => {
      e.event.stopPropagation();

      if (root.curDrawLine) {
        root.offCurDrawLine();
        clickToEnd.call(this, e);
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
      line.isFollowStart = line.startElement === this;

      const sin = line.isFollowStart ? line.startSin : line.endSin;
      const cos = line.isFollowStart ? line.startCos : line.endCos;

      line.followVertexElement(this.makeLineVertexByAngle(sin, cos));
    });
  },

  // 通过与宿主元素的 sin cos关系得到在宿主元素上的交点 用于更新当前线的端点
  makeLineVertexByAngle() {},

  removeLine(line) {
    console.log(this);
    // todo fix 删除元素不能删除线的bug
    this.lines.splice(
      this.lines.findIndex(d => d.line === line),
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

  line.startElement = this;
  line.startSin = sin;
  line.startCos = cos;

  this.lines.push(line);

  const root = this.root;

  line.el.silent = true;

  line.mount(root);

  root.curDrawLine = line;

  root.isNewPoint = true;
}

// 结束画线
function clickToEnd() {
  const root = this.root;

  const line = root.curDrawLine;
  const [last2, last] = line.makeDirectionPoints();

  const { point, sin, cos } = this.makeLineEndPoint(last2, last);

  const points = line.points;
  points[points.length - 1] = point;
  line.attr({
    points: points
  });
  line.isStartVertical = points[0][1] !== points[1][1];
  line.isEndVertical = root.isCurLineVertical;

  line.endElement = this;
  line.endSin = sin;
  line.endCos = cos;

  this.lines.push(line);

  line.el.silent = false;
  root.curDrawLine = null;
}

export { BaseLinkable };
