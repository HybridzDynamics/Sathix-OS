const EventEmitter = require('events');

class InMemoryQueue extends EventEmitter {
  constructor() {
    super();
    this.jobs = [];
  }

  async enqueue(type, payload) {
    const job = { id: `${Date.now()}-${Math.random().toString(36).slice(2,8)}`, type, payload, enqueuedAt: Date.now() };
    this.jobs.push(job);
    // emit immediately for in-process workers
    this.emit('job', job);
    return job;
  }

  // simple drain for tests
  async drain() {
    this.jobs = [];
  }
}

const defaultQueue = new InMemoryQueue();
module.exports = defaultQueue;
