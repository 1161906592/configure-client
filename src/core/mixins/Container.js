import { DrawLine } from "./DrawLine";
import { Resizable } from "./Resizable";
import { mixin } from "../helpers";

// 容器的抽象类 混入此类的类可以添加children 可以添加连接线 可以缩放
function Container(opts) {
  DrawLine.call(this, opts);
  Resizable.call(this, opts);
}

Container.prototype = {
  constructor: Container,

  isContainer: true
};

mixin(Container, DrawLine);
mixin(Container, Resizable);

export { Container };
