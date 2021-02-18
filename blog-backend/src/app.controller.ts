import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { DBService } from './database/database.service';

@Controller()
export class AppController {
  constructor(
    private readonly dbService: DBService,
    private readonly appService: AppService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test')
  async testDB(): Promise<any> {
    return await this.appService.testService();
  }
}
