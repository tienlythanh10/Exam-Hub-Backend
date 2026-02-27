import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis, RedisKey } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly redisClient: Redis) {}

  async get(key: RedisKey) {
    var data = await this.redisClient.get(key);
    return data;
  }

  async setex(
    key: RedisKey,
    seconds: number | string,
    value: string | Buffer | number,
  ) {
    await this.redisClient.setex(key, seconds, value);
  }

  async del(keys: RedisKey[]) {
    await this.redisClient.del(...keys);
  }
}
