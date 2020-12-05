import { typeEnum } from "./Element";

function addContextmenu(element, handler) {
  if (element.type === typeEnum.vertex) return;

  function contextmenu(e) {
    e.event.preventDefault();
    handler(element, e);
  }

  element.on("contextmenu", contextmenu);

  element.offContextmenu = () => {
    element.off("contextmenu", contextmenu);
  };
}
export { addContextmenu };
