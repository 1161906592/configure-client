import { platforms, Root } from "./Root";
import { Line } from "./elements/Line";
import { RectDOM } from "./elements/dom/RectDOM";
import { RectZR } from "./elements/zr/RectZR";
import { types } from "./Element";

export { Root, platforms, Line, RectDOM, RectZR, types };

// const data = JSON.parse(localStorage.getItem("data")) || [];
// console.log(data);
// const root = new Root({
//   el: document.querySelector("#root"),
//   oncontextmenu (item) {
//     item.setData({name: "test"})
//     switch (item.type) {
//       case types.rect:
//         item.setImage("/1.png");
//         break;
//     }
//   }
// });
//
// data.forEach((item) => {
//   let el;
//   switch (item.type) {
//     case types.rect:
//       el = item.platform === platforms.dom ? new RectDOM(item) : new RectZR(item);
//       break;
//     case types.line:
//       el = new Line(item);
//       break;
//   }
//   root.add(el);
// });
//
// let type;
// document.getElementById("div").ondragstart = function () {
//   type = "div";
// };
//
// document.getElementById("zr").ondragstart = function () {
//   type = "zr";
// };
//
// root.on("dragover", (e) => {
//   e.event.preventDefault();
// });
//
// root.on("drop", (e) => {
//   let rect;
//   switch (type) {
//     case "div":
//       rect = new RectDOM({
//         shape: {
//           x: e.offsetX,
//           y: e.offsetY
//         }
//       });
//       break;
//     case "zr":
//       rect = new RectZR({
//         shape: {
//           x: e.offsetX,
//           y: e.offsetY
//         }
//       });
//       break;
//   }
//   console.log(rect);
//   root.add(rect);
// });
//
// document.getElementById("drawLine").onclick = function () {
//   root.startDrawLine();
// };
// document.getElementById("move").onclick = function () {
//   root.startRectMove();
// };
// document.getElementById("resize").onclick = function () {
//   root.startRectResize();
// };
//
// document.getElementById("download").onclick = function () {
//   const data = root.getResult();
//   localStorage.setItem("data", JSON.stringify(data))
// };
