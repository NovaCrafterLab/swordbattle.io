// server/src/game/components/Quadtree.js

const { rectangleRectangle } = require('../collisions');

class QuadTreeImpl {
  constructor(boundary, capacity = 10, maxLevel = 4, level = 0) {
    this.boundary = boundary;
    this.capacity = capacity;
    this.maxLevel = maxLevel;
    this.level = level;

    this.items = [];
    this.nodes = [];
  }

  insert(rect) {
    if (!rectangleRectangle(this.boundary, rect)) return;

    if (this.nodes.length) {
      for (const node of this.nodes) node.insert(rect);
      return;
    }

    this.items.push(rect);

    if (
      this.items.length > this.capacity &&
      this.level < this.maxLevel &&
      !this.nodes.length
    ) {
      this.subdivide();
    }
  }

  subdivide() {
    const { x, y, width, height } = this.boundary;
    const hw = width / 2;
    const hh = height / 2;
    const next = this.level + 1;

    this.nodes.push(
      new QuadTree({ x: x + hw, y, width: hw, height: hh }, this.capacity, this.maxLevel, next),
      new QuadTree({ x, y, width: hw, height: hh }, this.capacity, this.maxLevel, next),
      new QuadTree({ x, y: y + hh, width: hw, height: hh }, this.capacity, this.maxLevel, next),
      new QuadTree({ x: x + hw, y: y + hh, width: hw, height: hh }, this.capacity, this.maxLevel, next),
    );

    for (const item of this.items) {
      for (const node of this.nodes) node.insert(item);
    }
    this.items = [];
  }

  get(rect) {
    if (!rectangleRectangle(this.boundary, rect)) return [];

    const seen = new Set();
    const unique = [];
    for (const itm of this.query(rect)) {
      const key = itm.entity ? itm.entity.id : itm;
      if (seen.has(key)) continue;
      seen.add(key);
      unique.push(itm);
    }
    return unique;
  }

  query(rect) {
    if (!rectangleRectangle(this.boundary, rect)) return [];

    let found = this.items;

    for (const node of this.nodes) {
      const sub = node.query(rect);
      if (sub.length) found = found.concat(sub);
    }
    return found;
  }

  clear() {
    this.items = [];
    for (const node of this.nodes) node.clear();
    this.nodes = [];
  }
}

module.exports = QuadTreeImpl;
