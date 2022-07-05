import ioredis from "ioredis";
class RedisInstance {
  redis;
  defaultExpiry = 60 * 60; // 1 hours
  constructor() {
    this.redis = new ioredis(6379, process.env.REDIS_URL, {
      keyPrefix: this.getPrefix(),
      enableAutoPipelining: true,
    });
  }

  getPrefix() {
    if (process.env.NODE_ENV === "development") {
      return process.env.REDIS_PREFIX + "dev_";
    }
    if (process.env.NODE_ENV === "staging") {
      return process.env.REDIS_PREFIX + "stg_";
    }
    return process.env.REDIS_PREFIX;
  }

  async set(key, value, exp = this.defaultExpiry) {
    await this.redis.set(key, JSON.stringify(value), "EX", exp);
  }

  async get(key) {
    const data = await this.redis.get(key);
    if (data == null) return null;
    else {
      return JSON.parse(data);
    }
  }

  async del(key) {
    await this.redis.del(key);
  }

  async getStream(pattern) {
    const prefix = this.getPrefix();
    return new Promise((resolve) => {
      const stream = this.redis.scanStream({
        match: `${prefix}${pattern}*`,
        count: 10,
      });
      stream.on("data", (resultKeys) => {
        resolve(resultKeys);
      });
      stream.on("end", () => {
        return resolve();
      });
    });
  }

  async deletePattern(pattern) {
    const prefix = this.getPrefix();
    return new Promise((resolve) => {
      const stream = this.redis.scanStream({
        match: `${prefix}${pattern}*`,
        count: 10,
      });
      const keys = [];
      stream.on("data", (resultKeys) => {
        if (resultKeys.length > 0) {
          resultKeys.map((key) => {
            keys.push(key.split(prefix)[1]);
          });
        }
      });
      stream.on("end", () => {
        if (keys.length > 0) {
          this.redis.unlink(keys);
        }
        resolve();
      });
    });
  }

  async flushall() {
    await this.redis.flushall();
  }
}

export const Redis = new RedisInstance();
