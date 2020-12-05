import { platformEnum } from "../../platform";
import { BaseCircle } from "../BaseCircle";
import { extend, mixin } from "../../helpers";
import { CircleImplDOM } from "../../mixins/CircleImplDOM";

function CircleDOM(opts) {
  BaseCircle.call(this, opts);
  CircleImplDOM.call(this, opts);
}

CircleDOM.prototype = {
  constructor: CircleDOM,

  platform: platformEnum.dom,

  update(shape) {
    BaseCircle.prototype.update.call(this, shape);
    CircleImplDOM.prototype.update.call(this, shape);
  }
};

extend(CircleDOM, BaseCircle);
mixin(CircleDOM, CircleImplDOM);

export { CircleDOM };
