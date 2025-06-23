// server/src/game/components/SpatialHash.js
const { rectangleRectangle } = require('../collisions');

const CELL_SIZE = parseInt(process.env.SPATIAL_CELL_SIZE, 10) || 256;
const QUERY_MARG = parseInt(process.env.SPATIAL_QUERY_MARGIN, 10) || 32;

class SpatialHash {
  constructor() {
    this.buckets = new Map();
  }

  static _hash(cx, cy) {
    return (cx << 16) ^ cy;
  }

  static _cellRange(min, max) {
    return [Math.floor(min / CELL_SIZE), Math.floor(max / CELL_SIZE)];
  }

  static _getEntityKey(rect) {
    return rect.entity.id;
  }

  insert(rect) {
    if (!rect.entity.prevRect) {
      rect.entity.prevRect = { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
    }

    const [minX, maxX] = SpatialHash._cellRange(rect.x, rect.x + rect.width);
    const [minY, maxY] = SpatialHash._cellRange(rect.y, rect.y + rect.height);
    const entityId = SpatialHash._getEntityKey(rect);

    for (let cy = minY; cy <= maxY; cy++) {
      for (let cx = minX; cx <= maxX; cx++) {
        const key = SpatialHash._hash(cx, cy);
        let bucket = this.buckets.get(key);
        if (!bucket) {
          bucket = new Map();
          this.buckets.set(key, bucket);
        }
        bucket.set(entityId, rect);
      }
    }
  }

  update(rect) {
    const prevRect = rect.entity.prevRect;
    if (!prevRect) {
      this.insert(rect);
      return;
    }

    const entityId = SpatialHash._getEntityKey(rect);

    const [currMinX, currMaxX] = SpatialHash._cellRange(rect.x, rect.x + rect.width);
    const [currMinY, currMaxY] = SpatialHash._cellRange(rect.y, rect.y + rect.height);
    const [prevMinX, prevMaxX] = SpatialHash._cellRange(prevRect.x, prevRect.x + prevRect.width);
    const [prevMinY, prevMaxY] = SpatialHash._cellRange(prevRect.y, prevRect.y + prevRect.height);

    if (
      currMinX === prevMinX &&
      currMaxX === prevMaxX &&
      currMinY === prevMinY &&
      currMaxY === prevMaxY
    ) return;

    const minX = Math.min(currMinX, prevMinX);
    const maxX = Math.max(currMaxX, prevMaxX);
    const minY = Math.min(currMinY, prevMinY);
    const maxY = Math.max(currMaxY, prevMaxY);

    for (let cy = minY; cy <= maxY; cy++) {
      for (let cx = minX; cx <= maxX; cx++) {
        const key = SpatialHash._hash(cx, cy);
        let bucket = this.buckets.get(key);

        const isInCurr = cx >= currMinX && cx <= currMaxX && cy >= currMinY && cy <= currMaxY;
        const isInPrev = cx >= prevMinX && cx <= prevMaxX && cy >= prevMinY && cy <= prevMaxY;

        if (isInCurr && !isInPrev) {
          if (!bucket) {
            bucket = new Map();
            this.buckets.set(key, bucket);
          }
          bucket.set(entityId, rect);
        } else if (!isInCurr && isInPrev) {
          if (bucket && bucket.has(entityId)) {
            bucket.delete(entityId);
            if (bucket.size === 0) {
              this.buckets.delete(key);
            }
          }
        }
      }
    }
    rect.entity.prevRect.x = rect.x;
    rect.entity.prevRect.y = rect.y;
    rect.entity.prevRect.width = rect.width;
    rect.entity.prevRect.height = rect.height;
  }

  remove(rect) {
    const prevRect = rect.entity.prevRect;
    if (!prevRect) return;
    const entityId = SpatialHash._getEntityKey(rect);

    const [minX, maxX] = SpatialHash._cellRange(prevRect.x, prevRect.x + prevRect.width);
    const [minY, maxY] = SpatialHash._cellRange(prevRect.y, prevRect.y + prevRect.height);

    for (let cy = minY; cy <= maxY; cy++) {
      for (let cx = minX; cx <= maxX; cx++) {
        const key = SpatialHash._hash(cx, cy);
        const bucket = this.buckets.get(key);
        if (!bucket) continue;

        bucket.delete(entityId);
        if (bucket.size === 0) {
          this.buckets.delete(key);
        }
      }
    }

    rect.entity.prevRect = null;
  }

  get(queryRect) {
    const minX = queryRect.x - QUERY_MARG;
    const minY = queryRect.y - QUERY_MARG;
    const maxX = queryRect.x + queryRect.width + QUERY_MARG;
    const maxY = queryRect.y + queryRect.height + QUERY_MARG;

    const [minCX, maxCX] = SpatialHash._cellRange(minX, maxX);
    const [minCY, maxCY] = SpatialHash._cellRange(minY, maxY);

    const seen = new Set();
    const result = [];

    for (let cy = minCY; cy <= maxCY; cy++) {
      for (let cx = minCX; cx <= maxCX; cx++) {
        const bucket = this.buckets.get(SpatialHash._hash(cx, cy));
        if (!bucket) continue;

        for (const rect of bucket.values()) {
          const key = SpatialHash._getEntityKey(rect);
          if (seen.has(key)) continue;

          // Early rejection: skip if AABB doesn't overlap (cheap check)
          if (
            queryRect.x + queryRect.width < rect.x ||
            rect.x + rect.width < queryRect.x ||
            queryRect.y + queryRect.height < rect.y ||
            rect.y + rect.height < queryRect.y
          ) {
            continue;
          }

          // Precise check (e.g., rotated or other shape collision)
          if (rectangleRectangle(queryRect, rect)) {
            seen.add(key);
            result.push(rect);
          }
        }
      }
    }
    return result;
  }

  clear() {
    this.buckets.clear();
  }
}

module.exports = SpatialHash;
