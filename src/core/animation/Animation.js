import { Animator } from "./Animator";

function Animation(options) {
  options = options || {};

  this.stage = options.stage || {};

  this.onframe = options.onframe || function() {};

  this._clips = [];

  this._running = false;

  this._time;

  this._pausedTime;

  this._pauseStart;

  this._paused = false;
}

Animation.prototype = {
  constructor: Animation,

  addClip: function(clip) {
    this._clips.push(clip);
  },

  addAnimator: function(animator) {
    animator.animation = this;
    let clips = animator.getClips();
    for (let i = 0; i < clips.length; i++) {
      this.addClip(clips[i]);
    }
  },

  removeClip: function(clip) {
    let idx = this._clips.indexOf(clip);
    if (idx >= 0) {
      this._clips.splice(idx, 1);
    }
  },

  removeAnimator: function(animator) {
    let clips = animator.getClips();
    for (let i = 0; i < clips.length; i++) {
      this.removeClip(clips[i]);
    }
    animator.animation = null;
  },

  _update: function() {
    let time = new Date().getTime() - this._pausedTime;
    let delta = time - this._time;
    let clips = this._clips;
    let len = clips.length;

    let deferredEvents = [];
    let deferredClips = [];
    for (let i = 0; i < len; i++) {
      let clip = clips[i];
      let e = clip.step(time, delta);
      if (e) {
        deferredEvents.push(e);
        deferredClips.push(clip);
      }
    }

    // Remove the finished clip
    for (let i = 0; i < len; ) {
      if (clips[i]._needsRemove) {
        clips[i] = clips[len - 1];
        clips.pop();
        len--;
      } else {
        i++;
      }
    }

    len = deferredEvents.length;
    for (let i = 0; i < len; i++) {
      deferredClips[i].fire(deferredEvents[i]);
    }

    this._time = time;

    this.onframe(delta);

    // this.trigger("frame", delta);
  },

  _startLoop: function() {
    let self = this;

    this._running = true;

    function step() {
      if (self._running) {
        requestAnimationFrame(step);

        !self._paused && self._update();
      }
    }

    requestAnimationFrame(step);
  },

  start: function() {
    this._time = new Date().getTime();
    this._pausedTime = 0;

    this._startLoop();
  },

  stop: function() {
    this._running = false;
  },

  /**
   * Pause animation.
   */
  pause: function() {
    if (!this._paused) {
      this._pauseStart = new Date().getTime();
      this._paused = true;
    }
  },

  resume: function() {
    if (this._paused) {
      this._pausedTime += new Date().getTime() - this._pauseStart;
      this._paused = false;
    }
  },

  clear: function() {
    this._clips = [];
  },

  isFinished: function() {
    return !this._clips.length;
  },

  animate: function(target, options) {
    options = options || {};

    let animator = new Animator(target, options.loop, options.getter, options.setter);

    this.addAnimator(animator);

    return animator;
  }
};

export { Animation };
