import { Injectable } from '@nestjs/common';
import { DBService } from './database/database.service';

@Injectable()
export class AppService {
  constructor(private readonly dbService: DBService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async testService(): Promise<string> {
    return await this.dbService.query('select * from user', []);
  }
}
