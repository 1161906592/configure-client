import { typeEnum } from "./Element";

export function addContextmenu(element, handler) {
  if (![typeEnum.rect, typeEnum.line, typeEnum.circle].includes(element.type)) return;
  function contextmenu(e) {
    e.event.preventDefault();
    handler(element, e);
  }

  element.on("contextmenu", contextmenu);

  element.offContextmenu = () => {
    element.off("contextmenu", contextmenu);
  };
}

export function click(element, handler) {
  if (![typeEnum.rect, typeEnum.line, typeEnum.circle].includes(element.type)) return;

  function click(e) {
    handler(element, e);
  }

  element.on("click", click);
}
