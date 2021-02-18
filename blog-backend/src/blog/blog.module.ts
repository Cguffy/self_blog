/* eslint-disable prettier/prettier */
import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { DBModule } from '../database/database.module';
import { LoginMiddleware } from '../middleWare/login.middleware'

@Module({
  imports: [DBModule],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoginMiddleware)
      .forRoutes('app/blog/viewed', 'app/blog/update', 'app/blog/self', { path: 'app/blog', method: RequestMethod.POST });
  }
}
