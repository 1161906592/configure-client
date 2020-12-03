import { Vertex } from "../Vertex";
import { extend, mixin } from "../../helpers";
import { CircleZR } from "./CircleZR";

export function VertexZR(opts) {
  CircleZR.call(this, opts);
  Vertex.call(this, opts);

  this.style.fill = "#fff";
}

extend(VertexZR, CircleZR);
mixin(VertexZR, Vertex);
