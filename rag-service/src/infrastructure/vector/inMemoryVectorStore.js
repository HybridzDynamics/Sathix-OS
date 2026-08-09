const VectorStore = require('../../domain/ports/vectorStore');

class InMemoryVectorStore extends VectorStore {
  constructor() {
    super();
    this.collections = new Map(); // collectionName -> { points: Map(id->point), dim }
  }

  async ensureCollection(name, config = {}) {
    if (!this.collections.has(name)) {
      this.collections.set(name, { points: new Map(), dim: config.size || 0, distance: config.distance || 'cosine' });
    }
    return true;
  }

  async upsert(collection, items) {
    const col = this.collections.get(collection);
    if (!col) throw new Error(`Collection ${collection} not found`);
    for (const it of items) {
      // item: { id, vector, payload }
      col.points.set(it.id, { id: it.id, vector: it.vector, payload: it.payload });
    }
    return { upserted: items.length };
  }

  _cosine(a, b) {
    let dot = 0, na = 0, nb = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      na += a[i] * a[i];
      nb += b[i] * b[i];
    }
    if (na === 0 || nb === 0) return 0;
    return dot / (Math.sqrt(na) * Math.sqrt(nb));
  }

  async search(collection, vector, topK = 10, filters = {}) {
    const col = this.collections.get(collection);
    if (!col) throw new Error(`Collection ${collection} not found`);
    const results = [];
    for (const p of col.points.values()) {
      if (filters && Object.keys(filters).length) {
        let skip = false;
        for (const k of Object.keys(filters)) {
          if (!p.payload || p.payload[k] !== filters[k]) { skip = true; break; }
        }
        if (skip) continue;
      }
      const score = this._cosine(vector, p.vector);
      results.push({ id: p.id, score, payload: p.payload });
    }
    results.sort((a, b) => b.score - a.score);
    return results.slice(0, topK);
  }

  async delete(collection, ids) {
    const col = this.collections.get(collection);
    if (!col) throw new Error(`Collection ${collection} not found`);
    let removed = 0;
    for (const id of ids) {
      if (col.points.delete(id)) removed += 1;
    }
    return { removed };
  }
}

module.exports = InMemoryVectorStore;
