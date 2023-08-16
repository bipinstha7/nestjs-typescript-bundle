import { Pool } from 'pg';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export default class RawDatabaseService {
  constructor(@Inject('CONNECTION_POOL') private readonly pool: Pool) {}

  async runQuery(query: string, params?: unknown[]) {
    return this.pool.query(query, params);
  }
}
