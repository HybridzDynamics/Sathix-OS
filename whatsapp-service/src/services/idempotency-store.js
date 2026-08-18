class IdempotencyStore {
  constructor(ttlMs) { this.ttlMs = ttlMs; this.entries = new Map(); }
  claim(id) { const now = Date.now(); for (const [key, expiry] of this.entries) if (expiry <= now) this.entries.delete(key); if (this.entries.has(id)) return false; this.entries.set(id, now + this.ttlMs); return true; }
}
module.exports = { IdempotencyStore };
