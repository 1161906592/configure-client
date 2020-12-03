export function mixin(target, source, overlay) {
  target = "prototype" in target ? target.prototype : target;
  source = "prototype" in source ? source.prototype : source;

  defaults(target, source, overlay);

  function defaults(target, source, overlay) {
    for (var key in source) {
      if (hasOwnProperty(source, key) && (overlay ? source[key] != null : target[key] == null)) {
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

export function makeRectVertexes(rect) {
  const shape = rect.shape;
  const halfW = shape.width / 2;
  const halfH = shape.height / 2;
  return [
    [shape.x, shape.y],
    [shape.x + halfW, shape.y],
    [shape.x + shape.width, shape.y],
    [shape.x + shape.width, shape.y + halfH],
    [shape.x + shape.width, shape.y + shape.height],
    [shape.x + halfW, shape.y + shape.height],
    [shape.x, shape.y + shape.height],
    [shape.x, shape.y + halfH]
  ];
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

export function copyProperties(from, props) {
  const to = {};
  props.forEach(prop => {
    if (hasOwnProperty(from, prop)) {
      to[prop] = from[prop];
    }
  });
  return to;
}

export function calcDOMOffset(el) {
  let offset = {
    left: 0,
    top: 0
  };
  el = el.offsetParent;
  while (el) {
    offset.left += el.offsetLeft;
    offset.top += el.offsetTop;
    el = el.offsetParent;
  }
  return offset;
}

export function makeMap(list, fn) {
  const map = {};
  list.forEach((item, index) => {
    fn(map, item, index);
  });
  return map;
}
