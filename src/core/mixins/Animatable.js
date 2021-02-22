import { Animator } from "../animation/Animator";
import { hasOwnProperty } from "@/core/helpers";

/**
 * @alias module:zrender/mixin/Animatable
 * @constructor
 */
function Animatable() {
  this.animators = [];
}

Animatable.prototype = {
  constructor: Animatable,

  /**
   * 动画
   *
   * @param {string} path The path to fetch value from object, like 'a.b.c'.
   * @param {boolean} [loop] Whether to loop animation.
   * @return {module:zrender/animation/Animator}
   * @example:
   *     el.animate('style', false)
   *         .when(1000, {x: 10} )
   *         .done(function(){ // Animation done })
   *         .start()
   */
  animate: function(path, loop) {
    var animators = this.animators;

    var animator = new Animator(this, loop);

    animator.done(function() {
      animators.splice(animators.indexOf(animator), 1);
    });

    animators.push(animator);

    if (this.root) {
      this.root.animation.addAnimator(animator);
    }

    return animator;
  },

  stopAnimation: function(forwardToLast) {
    var animators = this.animators;
    var len = animators.length;
    for (var i = 0; i < len; i++) {
      animators[i].stop(forwardToLast);
    }
    animators.length = 0;

    return this;
  },

  /**
   * Caution: this method will stop previous animation.
   * So do not use this method to one element twice before
   * animation starts, unless you know what you are doing.
   * @param {Object} target
   * @param {number} [time=500] Time in ms
   * @param {string} [easing='linear']
   * @param {number} [delay=0]
   * @param {Function} [callback]
   * @param {Function} [forceAnimate] Prevent stop animation and callback
   *        immediently when target values are the same as current values.
   *
   * @example
   *  // Animate position
   *  el.animateTo({
   *      position: [10, 10]
   *  }, function () { // done })
   *
   *  // Animate shape, style and position in 100ms, delayed 100ms, with cubicOut easing
   *  el.animateTo({
   *      shape: {
   *          width: 500
   *      },
   *      style: {
   *          fill: 'red'
   *      }
   *      position: [10, 10]
   *  }, 100, 100, 'cubicOut', function () { // done })
   */
  // TODO Return animation key
  animateTo: function(target, time, delay, easing, callback, forceAnimate) {
    animateTo(this, target, time, delay, easing, callback, forceAnimate);
  },

  /**
   * Animate from the target state to current state.
   * The params and the return value are the same as `this.animateTo`.
   */
  animateFrom: function(target, time, delay, easing, callback, forceAnimate) {
    animateTo(this, target, time, delay, easing, callback, forceAnimate, true);
  }
};

function animateTo(animatable, target, time, delay, easing, callback, forceAnimate, reverse) {
  // animateTo(target, time, easing, callback);
  if (typeof delay === "string") {
    callback = easing;
    easing = delay;
    delay = 0;
  }
  // animateTo(target, time, delay, callback);
  else if (typeof easing === "function") {
    callback = easing;
    easing = "linear";
    delay = 0;
  }
  // animateTo(target, time, callback);
  else if (typeof delay === "function") {
    callback = delay;
    delay = 0;
  }
  // animateTo(target, callback)
  else if (typeof time === "function") {
    callback = time;
    time = 500;
  }
  // animateTo(target)
  else if (!time) {
    time = 500;
  }
  animatable.stopAnimation();
  animateToShallow(animatable, "", animatable, target, time, delay, reverse);

  var animators = animatable.animators.slice();
  var count = animators.length;
  function done() {
    count--;
    if (!count) {
      callback && callback();
    }
  }

  if (!count) {
    callback && callback();
  }
  for (var i = 0; i < animators.length; i++) {
    animators[i].done(done).start(easing, forceAnimate);
  }
}

/**
 * @param {string} path=''
 * @param {Object} source=animatable
 * @param {Object} target
 * @param {number} [time=500]
 * @param {number} [delay=0]
 * @param {boolean} [reverse] If `true`, animate
 *        from the `target` to current state.
 *
 * @example
 *  // Animate position
 *  el._animateToShallow({
 *      position: [10, 10]
 *  })
 *
 *  // Animate shape, style and position in 100ms, delayed 100ms
 *  el._animateToShallow({
 *      shape: {
 *          width: 500
 *      },
 *      style: {
 *          fill: 'red'
 *      }
 *      position: [10, 10]
 *  }, 100, 100)
 */
function animateToShallow(animatable, path, source, target, time, delay, reverse) {
  var objShallow = {};
  var propertyCount = 0;
  for (var name in target) {
    if (!hasOwnProperty(target, name)) {
      continue;
    }

    if (source[name] != null) {
      if (reverse) {
        objShallow[name] = source[name];
        setAttrByPath(animatable, path, name, target[name]);
      } else {
        objShallow[name] = target[name];
      }
      propertyCount++;
    } else if (target[name] != null && !reverse) {
      setAttrByPath(animatable, path, name, target[name]);
    }
  }

  if (propertyCount > 0) {
    animatable
      .animate(path, false)
      .when(time == null ? 500 : time, objShallow)
      .delay(delay || 0);
  }
}

function setAttrByPath(el, path, name, value) {
  el.attr(name, value);
}

export { Animatable };
