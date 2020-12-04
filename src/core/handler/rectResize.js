// 左上
export function resizeRectLT(rect, offset) {
  const shape = rect.shape;
  shape.x += offset.x;
  shape.y += offset.y;
  shape.width -= offset.x;
  shape.height -= offset.y;
}

// 上
export function resizeRectT(rect, offset) {
  const shape = rect.shape;
  shape.y += offset.y;
  shape.height -= offset.y;
}

// 右上
export function resizeRectRT(rect, offset) {
  const shape = rect.shape;
  // shape.x -= offset.x;
  shape.width += offset.x;
  shape.y += offset.y;
  shape.height -= offset.y;
}

// 右
export function resizeRectR(rect, offset) {
  const shape = rect.shape;
  // shape.x -= offset.x;
  shape.width += offset.x;
}

// 右下
export function resizeRectRB(rect, offset) {
  const shape = rect.shape;
  // shape.x -= offset.x;
  shape.width += offset.x;
  shape.height += offset.y;
}

// 下
export function resizeRectB(rect, offset) {
  const shape = rect.shape;
  // shape.y -= offset.y;
  shape.height += offset.y;
}

// 左下
export function resizeRectLB(rect, offset) {
  const shape = rect.shape;
  shape.x += offset.x;
  shape.width -= offset.x;
  shape.height += offset.y;
}

// 左
export function resizeRectL(rect, offset) {
  const shape = rect.shape;
  shape.x += offset.x;
  shape.width -= offset.x;
}

// 左上
export function lineFollowRectLT(rect, offset) {
  const elementMap = rect.root.elementMap;
  rect.lines.forEach(item => {
    const line = elementMap[item.id];
    line.isFollowStart = item.isStart;
    const points = line.shape.points;
    const point = item.isStart ? points[0] : points[points.length - 1];
    if (line.isStartVertical || line.isEndVertical) {
      line.followHost({
        x: point[0] < rect.shape.x || point[0] > rect.shape.x + rect.shape.width ? offset.x : 0,
        y: item.isBottom ? 0 : offset.y
      });
    } else {
      line.followHost({
        x: item.isRight ? 0 : offset.x,
        y: point[1] < rect.shape.y || point[1] > rect.shape.y + rect.shape.height ? offset.y : 0
      });
    }
  });
}

// 上
export function lineFollowRectT(rect, offset) {
  const elementMap = rect.root.elementMap;
  rect.lines.forEach(item => {
    const line = elementMap[item.id];
    line.isFollowStart = item.isStart;
    if (line.isStartVertical || line.isEndVertical) {
      line.followHost({
        x: 0,
        y: item.isBottom ? 0 : offset.y
      });
    } else {
      const points = line.shape.points;
      const point = item.isStart ? points[0] : points[points.length - 1];
      line.followHost({
        x: 0,
        y: point[1] < rect.shape.y || point[1] > rect.shape.y + rect.shape.height ? offset.y : 0
      });
    }
  });
}

// 右上
export function lineFollowRectRT(rect, offset) {
  const elementMap = rect.root.elementMap;
  rect.lines.forEach(item => {
    const line = elementMap[item.id];
    line.isFollowStart = item.isStart;
    const points = line.shape.points;
    const point = item.isStart ? points[0] : points[points.length - 1];
    if (line.isStartVertical || line.isEndVertical) {
      line.followHost({
        x: point[0] < rect.shape.x || point[0] > rect.shape.x + rect.shape.width ? offset.x : 0,
        y: item.isBottom ? 0 : offset.y
      });
    } else {
      line.followHost({
        x: item.isRight ? offset.x : 0,
        y: point[1] < rect.shape.y || point[1] > rect.shape.y + rect.shape.height ? offset.y : 0
      });
    }
  });
}

// 右
export function lineFollowRectR(rect, offset) {
  const elementMap = rect.root.elementMap;
  rect.lines.forEach(item => {
    const line = elementMap[item.id];
    line.isFollowStart = item.isStart;
    if (!line.isStartVertical && !line.isEndVertical) {
      line.followHost({
        x: item.isRight ? offset.x : 0,
        y: 0
      });
    } else {
      const points = line.shape.points;
      const point = item.isStart ? points[0] : points[points.length - 1];
      line.followHost({
        x: point[0] < rect.shape.x || point[0] > rect.shape.x + rect.shape.width ? offset.x : 0,
        y: 0
      });
    }
  });
}

// 右下
export function lineFollowRectRB(rect, offset) {
  const elementMap = rect.root.elementMap;
  rect.lines.forEach(item => {
    const line = elementMap[item.id];
    line.isFollowStart = item.isStart;
    const points = line.shape.points;
    const point = item.isStart ? points[0] : points[points.length - 1];
    if (line.isStartVertical || line.isEndVertical) {
      line.followHost({
        x: point[0] < rect.shape.x || point[0] > rect.shape.x + rect.shape.width ? offset.x : 0,
        y: item.isBottom ? offset.y : 0
      });
    } else {
      line.followHost({
        x: item.isRight ? offset.x : 0,
        y: point[1] < rect.shape.y || point[1] > rect.shape.y + rect.shape.height ? offset.y : 0
      });
    }
  });
}

// 下
export function lineFollowRectB(rect, offset) {
  const elementMap = rect.root.elementMap;
  rect.lines.forEach(item => {
    const line = elementMap[item.id];
    line.isFollowStart = item.isStart;
    if (line.isStartVertical || line.isEndVertical) {
      line.followHost({
        x: 0,
        y: item.isBottom ? offset.y : 0
      });
    } else {
      const points = line.shape.points;
      const point = item.isStart ? points[0] : points[points.length - 1];
      line.followHost({
        x: 0,
        y: point[1] < rect.shape.y || point[1] > rect.shape.y + rect.shape.height ? offset.y : 0
      });
    }
  });
}

// 左下
export function lineFollowRectLB(rect, offset) {
  const elementMap = rect.root.elementMap;
  rect.lines.forEach(item => {
    const line = elementMap[item.id];
    line.isFollowStart = item.isStart;
    const points = line.shape.points;
    const point = item.isStart ? points[0] : points[points.length - 1];
    if (line.isStartVertical || line.isEndVertical) {
      line.followHost({
        x: point[0] < rect.shape.x || point[0] > rect.shape.x + rect.shape.width ? offset.x : 0,
        y: item.isBottom ? offset.y : 0
      });
    } else {
      line.followHost({
        x: item.isRight ? 0 : offset.x,
        y: point[1] < rect.shape.y || point[1] > rect.shape.y + rect.shape.height ? offset.y : 0
      });
    }
  });
}

// 左
export function lineFollowRectL(rect, offset) {
  const elementMap = rect.root.elementMap;
  rect.lines.forEach(item => {
    const line = elementMap[item.id];
    line.isFollowStart = item.isStart;
    if (!line.isStartVertical && !line.isEndVertical) {
      line.followHost({
        x: item.isRight ? 0 : offset.x,
        y: 0
      });
    } else {
      const points = line.shape.points;
      const point = item.isStart ? points[0] : points[points.length - 1];
      line.followHost({
        x: point[0] < rect.shape.x || point[0] > rect.shape.x + rect.shape.width ? offset.x : 0,
        y: 0
      });
    }
  });
}
