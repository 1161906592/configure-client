import { Vertex } from "../Vertex";
import { extend, mixin } from "../../helpers";
import { CircleDOM } from "./CircleDOM";

export function VertexDOM(opts) {
  CircleDOM.call(this, opts);
  Vertex.call(this, opts);

  this.style.background = "#fff";
}

extend(VertexDOM, CircleDOM);
mixin(VertexDOM, Vertex);
