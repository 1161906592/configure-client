import { Element, typeEnum } from "../Element";
import { extend } from "../helpers";

export function BaseCircle(opts) {
  Element.call(this, opts);
  this.type = typeEnum.circle;
  this.shape = {
    x: 0,
    y: 0,
    r: 32,
    ...this.shape
  };
}

BaseCircle.prototype = {
  constructor: BaseCircle
};

extend(BaseCircle, Element);
