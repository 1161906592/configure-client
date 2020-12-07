import { platformEnum } from "../../enums";
import { BaseCircle } from "../BaseCircle";
import { extend, mixin } from "../../helpers";
import { CircleImplDOM } from "../../mixins/CircleImplDOM";

function CircleDOM(opts) {
  BaseCircle.call(this, opts);
  CircleImplDOM.call(this, opts);
}

CircleDOM.prototype = {
  constructor: CircleDOM,

  platform: platformEnum.dom
};

extend(CircleDOM, BaseCircle);
mixin(CircleDOM, CircleImplDOM);

export { CircleDOM };
