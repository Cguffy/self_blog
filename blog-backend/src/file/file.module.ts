/* eslint-disable prettier/prettier */
import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { DBModule } from '../database/database.module';
import { LoginMiddleware } from '../middleWare/login.middleware'

@Module({
  imports: [DBModule],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoginMiddleware)
      .forRoutes({path: 'app/file', method: RequestMethod.POST});
  }
}
