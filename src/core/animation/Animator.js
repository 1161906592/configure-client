import { Clip } from "./Clip";
import { hasOwnProperty } from "@/core/helpers";

function defaultGetter(target, key) {
  return target[key];
}

function defaultSetter(target, key, value) {
  target[key] = value;
}

function Animator(target, loop, getter, setter) {
  this._tracks = {};
  this._target = target;

  this._loop = loop || false;

  this._getter = getter || defaultGetter;
  this._setter = setter || defaultSetter;

  this._clipCount = 0;

  this._delay = 0;

  this._doneList = [];

  this._onframeList = [];

  this._clipList = [];
}

Animator.prototype = {
  constructor: Animator,

  when: function(time /* ms */, props) {
    let tracks = this._tracks;
    for (let propName in props) {
      if (!hasOwnProperty(props, propName)) {
        continue;
      }

      if (!tracks[propName]) {
        tracks[propName] = [];
        // Invalid value
        let value = this._getter(this._target, propName);
        if (value == null) {
          // zrLog('Invalid property ' + propName);
          continue;
        }
        if (time !== 0) {
          tracks[propName].push({
            time: 0,
            value: value
          });
        }
      }
      tracks[propName].push({
        time: time,
        value: props[propName]
      });
    }
    return this;
  },
  during: function(callback) {
    this._onframeList.push(callback);
    return this;
  },

  pause: function() {
    for (let i = 0; i < this._clipList.length; i++) {
      this._clipList[i].pause();
    }
    this._paused = true;
  },

  resume: function() {
    for (let i = 0; i < this._clipList.length; i++) {
      this._clipList[i].resume();
    }
    this._paused = false;
  },

  isPaused: function() {
    return !!this._paused;
  },

  _doneCallback: function() {
    // Clear all tracks
    this._tracks = {};
    // Clear all clips
    this._clipList.length = 0;

    let doneList = this._doneList;
    let len = doneList.length;
    for (let i = 0; i < len; i++) {
      doneList[i].call(this);
    }
  },
  start: function(easing, forceAnimate) {
    let self = this;
    let clipCount = 0;

    let oneTrackDone = function() {
      clipCount--;
      if (!clipCount) {
        self._doneCallback();
      }
    };

    let lastClip;
    for (let propName in this._tracks) {
      if (!hasOwnProperty(this._tracks, propName)) {
        continue;
      }
      let clip = createTrackClip(this, easing, oneTrackDone, this._tracks[propName], propName, forceAnimate);
      if (clip) {
        this._clipList.push(clip);
        clipCount++;

        // If start after added to animation
        if (this.animation) {
          this.animation.addClip(clip);
        }

        lastClip = clip;
      }
    }

    // Add during callback on the last clip
    if (lastClip) {
      let oldOnFrame = lastClip.onframe;
      lastClip.onframe = function(target, percent) {
        oldOnFrame(target, percent);

        for (let i = 0; i < self._onframeList.length; i++) {
          self._onframeList[i](target, percent);
        }
      };
    }

    if (!clipCount) {
      this._doneCallback();
    }
    return this;
  },

  stop: function(forwardToLast) {
    let clipList = this._clipList;
    let animation = this.animation;
    for (let i = 0; i < clipList.length; i++) {
      let clip = clipList[i];
      if (forwardToLast) {
        // Move to last frame before stop
        clip.onframe(this._target, 1);
      }
      animation && animation.removeClip(clip);
    }
    clipList.length = 0;
  },
  delay: function(time) {
    this._delay = time;
    return this;
  },
  done: function(cb) {
    if (cb) {
      this._doneList.push(cb);
    }
    return this;
  },
  getClips: function() {
    return this._clipList;
  }
};

function interpolateNumber(p0, p1, percent) {
  return (p1 - p0) * percent + p0;
}

function createTrackClip(animator, easing, oneTrackDone, keyframes, propName, forceAnimate) {
  // var setter = animator._setter;

  let trackLen = keyframes.length;
  if (!trackLen) {
    return;
  }

  let trackMaxTime;
  // Sort keyframe as ascending
  keyframes.sort(function(a, b) {
    return a.time - b.time;
  });

  trackMaxTime = keyframes[trackLen - 1].time;
  let kfPercents = [];
  let kfValues = [];
  let prevValue = keyframes[0].value;
  let isAllValueEqual = true;
  for (let i = 0; i < trackLen; i++) {
    kfPercents.push(keyframes[i].time / trackMaxTime);
    let value = keyframes[i].value;

    if (value === prevValue) {
      isAllValueEqual = false;
    }
    prevValue = value;

    kfValues.push(value);
  }
  if (!forceAnimate && isAllValueEqual) {
    return;
  }

  let lastValue = kfValues[trackLen - 1];
  for (let i = 0; i < trackLen - 1; i++) {
    if (isNaN(kfValues[i]) && !isNaN(lastValue)) {
      kfValues[i] = lastValue;
    }
  }

  let lastFrame = 0;
  let lastFramePercent = 0;
  let start;
  let w;

  let onframe = function(target, percent) {
    let frame;
    if (percent < 0) {
      frame = 0;
    } else if (percent < lastFramePercent) {
      start = Math.min(lastFrame + 1, trackLen - 1);
      for (frame = start; frame >= 0; frame--) {
        if (kfPercents[frame] <= percent) {
          break;
        }
      }
      frame = Math.min(frame, trackLen - 2);
    } else {
      for (frame = lastFrame; frame < trackLen; frame++) {
        if (kfPercents[frame] > percent) {
          break;
        }
      }
      frame = Math.min(frame - 1, trackLen - 2);
    }
    lastFrame = frame;
    lastFramePercent = percent;

    let range = kfPercents[frame + 1] - kfPercents[frame];
    if (range === 0) {
      return;
    } else {
      w = (percent - kfPercents[frame]) / range;
    }
    let value = interpolateNumber(kfValues[frame], kfValues[frame + 1], w);
    // setter(target, propName, value);
    target.attr(propName, value);
  };

  let clip = new Clip({
    target: animator._target,
    life: trackMaxTime,
    loop: animator._loop,
    delay: animator._delay,
    onframe: onframe,
    ondestroy: oneTrackDone
  });

  if (easing) {
    clip.easing = easing;
  }

  return clip;
}

export { Animator };
