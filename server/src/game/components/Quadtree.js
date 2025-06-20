// server/src/game/components/Quadtree.js

const QuadTreeImpl = require('./QuadTreeLegacy');
const SpatialHash = require('./SpatialHash');

const USE_HASH = process.env.SPATIAL_HASH !== '0';

class IndexProxy {
    constructor(boundary, capacity, maxLevel, level) {
        this.impl = USE_HASH
            ? new SpatialHash(boundary)
            : new QuadTreeImpl(boundary, capacity, maxLevel, level);
    }
    insert(rect) { this.impl.insert(rect); }
    get(rect) { return this.impl.get(rect); }
    clear() { this.impl.clear(); }
}

module.exports = IndexProxy;
