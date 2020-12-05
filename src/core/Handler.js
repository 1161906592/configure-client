function HandlerProxy(storage) {
  this.typeMap = new Map();
  this.storage = storage;
}

HandlerProxy.prototype = {
  constructor: HandlerProxy,

  on(type, handler) {
    const handlerMap = new Map();
    this.typeMap.set(type, handlerMap);
    const elementMap = new Map();
    handlerMap.set(handler, elementMap);
    this.storage.getElementList().forEach(element => {
      const wrappedHandler = e => {
        handler(element, e);
      };
      elementMap.set(element, wrappedHandler);
      element.on(type, wrappedHandler);
    });
  },

  off(type, handler) {
    if (!this.typeMap[type]) return;
    this.storage.getElementList().forEach(element => {
      const handlerMap = this.typeMap.get(type);
      const elementMap = handlerMap.get(handler);
      const wrappedHandler = elementMap.get(element);
      element.off(type, wrappedHandler);
      elementMap.delete(element);
      if (!elementMap.size) {
        handlerMap.delete(handler);
      }
      if (!handlerMap.size) {
        this.typeMap.delete(type);
      }
    });
  },

  addElement(element) {
    this.typeMap.forEach((handlerMap, type) => {
      handlerMap.forEach((elementMap, handler) => {
        const wrappedHandler = e => {
          handler(element, e);
        };
        elementMap.set(element, wrappedHandler);
        element.on(type, wrappedHandler);
      });
    });
  },

  removeElement(element) {
    this.typeMap.forEach((handlerMap, type) => {
      handlerMap.forEach(elementMap => {
        element.off(type, elementMap.get(element));
        elementMap.delete(element);
      });
    });
  }
};

export { HandlerProxy };
