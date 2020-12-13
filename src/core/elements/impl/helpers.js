import { createSvgNode } from "../../helpers";

export function createAnimateNode(element) {
  const animateNode = createSvgNode("circle");
  animateNode.setAttribute("r", 4);
  animateNode.setAttribute("fill", "#666");

  const animateMotion = createSvgNode("animateMotion");
  animateNode.appendChild(animateMotion);

  // animateMotion.setAttribute("path", makeAnimatePath(element));
  animateMotion.setAttribute("begin", "0s");
  animateMotion.setAttribute("dur", "3s");
  animateMotion.setAttribute("repeatCount", "indefinite");

  element.animateMotion = animateMotion;
  return animateNode;
}

export function makeAnimatePath(element) {
  const points = element.points;
  const [x, y] = points[0];
  return "M" + points.map(([x1, y1]) => [x1 - x, y1 - y].join(",")).join(" L");
}
