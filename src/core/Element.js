import { guid, hasOwnProperty } from "./helpers";
import { Contextmenu } from "./Contextmenu";
import { RectDOM } from "./index";

export const types = {
  rect: 1,
  line: 2,
  rectVertex: 3
};

/**
 * @description 所有元素的抽象类
 **/

export class Element {
  constructor(opts) {
    this.id = guid();
    this.init();
    for (var name in opts) {
      if (hasOwnProperty(opts, name) && name !== "shape" && name !== "style") {
        this[name] = opts[name];
      }
    }
    this.shape = {
      ...this.shape,
      ...opts.shape
    };
    this.style = {
      ...this.style,
      ...opts.style
    };
    this.children = [];
    opts.children?.forEach(item => {
      const element = new RectDOM(item);
      this.children.push(element);
    });
    this.render();
  }

  init() {
    this.shape = {};
    this.style = {};
  }

  // Interface
  render() {}

  // Interface
  addToRoot(root) {
    this.root = root;
    Contextmenu.call(this);
    this.children.forEach(element => {
      root.add(element);
    });
  }

  // Interface
  removeFromRoot() {
    this.offContextmenu?.();
  }

  // Interface
  follow() {}

  // Interface
  setShape(shape) {
    this.shape = {
      ...this.shape,
      ...shape
    };
  }

  setData(data) {
    this.data = data;
  }
}
