// server/src/game/components/SpatialHash.js
const { rectangleRectangle } = require('../collisions');

const CELL_SIZE  = parseInt(process.env.SPATIAL_CELL_SIZE, 10)  || 256;
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

  insert(rect) {
    const [minX, maxX] = SpatialHash._cellRange(rect.x, rect.x + rect.width);
    const [minY, maxY] = SpatialHash._cellRange(rect.y, rect.y + rect.height);

    for (let cy = minY; cy <= maxY; cy++) {
      for (let cx = minX; cx <= maxX; cx++) {
        const key = SpatialHash._hash(cx, cy);
        let bucket = this.buckets.get(key);
        if (!bucket) {
          bucket = [];
          this.buckets.set(key, bucket);
        }
        bucket.push(rect);
      }
    }
  }

  get(queryRect) {
    const minX = queryRect.x - QUERY_MARG;
    const minY = queryRect.y - QUERY_MARG;
    const maxX = queryRect.x + queryRect.width  + QUERY_MARG;
    const maxY = queryRect.y + queryRect.height + QUERY_MARG;

    const [minCX, maxCX] = SpatialHash._cellRange(minX, maxX);
    const [minCY, maxCY] = SpatialHash._cellRange(minY, maxY);

    const seen = new Set();
    const result = [];

    for (let cy = minCY; cy <= maxCY; cy++) {
      for (let cx = minCX; cx <= maxCX; cx++) {
        const bucket = this.buckets.get(SpatialHash._hash(cx, cy));
        if (!bucket) continue;

        for (let i = 0; i < bucket.length; i++) {
          const rect = bucket[i];
          const key = rect.entity ? rect.entity.id : rect;
          if (seen.has(key)) continue;
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
