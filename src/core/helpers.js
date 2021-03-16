export function mixin(target, source, overlay) {
  target = "prototype" in target ? target.prototype : target;
  source = "prototype" in source ? source.prototype : source;

  defaults(target, source, overlay);

  function defaults(target, source, overlay) {
    for (var key in source) {
      if (hasOwnProperty(source, key) && (overlay ? hasOwnProperty(source, key) : !hasOwnProperty(target, key))) {
        target[key] = source[key];
      }
    }
    return target;
  }
}

export function extend(subClass, superClass) {
  const subPrototype = subClass.prototype;

  subClass.prototype = Object.create(superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });

  eachObj(subPrototype, (value, prop) => {
    subClass.prototype[prop] = value;
  });

  setPrototypeOf(subClass, superClass);
}

export function guid() {
  return "xxxxxxxx-xxxx-yxxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function lastItem(list, index = 1) {
  return list[list.length - index];
}

export function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

export const setPrototypeOf =
  Object.setPrototypeOf ||
  function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

export function eachObj(obj, fn) {
  for (let key in obj) {
    if (hasOwnProperty(obj, key)) {
      fn(obj[key], key, obj);
    }
  }
}

export function makeMap(list, fn) {
  const map = {};
  list.forEach((item, index) => {
    fn(map, item, index);
  });
  return map;
}

export function fixZrCoordinate(n) {
  return ~~n + 0.5;
  // return ~~n;
}

export function createSvgNode(qualifiedName) {
  return document.createElementNS("http://www.w3.org/2000/svg", qualifiedName);
}

// 按键
export function handleKeyEvent(e, handles, cb) {
  const curHandler = handles[e.key];
  if (curHandler) {
    if (isFunction(curHandler)) {
      if (!e.ctrlKey && !e.altKey) {
        curHandler();
        cb?.();
      }
    } else {
      const { modifiers, handler } = curHandler;
      if (!modifiers || ((modifiers.ctrl ? e.ctrlKey : true) && (modifiers.alt ? e.altKey : true))) {
        handler();
        cb?.();
      }
    }
  }
}

export function isFunction(target) {
  return target && typeof target === "function";
}

export function LinkNode(data) {
  this.prev = null;
  this.next = null;
  this.data = data;
}
