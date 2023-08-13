import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import Log from './log.entity';
import CreateLogDto from './dto/createLog.dto';

@Injectable()
export default class LogsService {
  constructor(
    @InjectRepository(Log)
    private logsRepository: Repository<Log>,
  ) {}

  async createLog(log: CreateLogDto) {
    const newLog = await this.logsRepository.create(log);
    await this.logsRepository.save(newLog, {
      data: {
        isCreatingLogs: true,
        /* 
        Above, we notice that we pass isCreatingLogs: true when saving our logs to the database. The above is because we need to overcome the issue of an infinite loop. When we store logs in the database, it causes SQL queries to be logged. When we log SQL queries, they are saved to the database, causing an infinite loop. Because of that, we need to check this in our DatabaseLogger */
      },
    });
    return newLog;
  }
}
