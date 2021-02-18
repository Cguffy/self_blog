/* eslint-disable prettier/prettier */
import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DBModule } from '../database/database.module';
import { LoginMiddleware } from '../middleWare/login.middleware'

@Module({
  imports: [DBModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoginMiddleware)
      .forRoutes('app/user/update', 'app/user/logout', 'app/user/isLogin', 'app/user/blogsCount', { path: 'app/user/selfInfo', method: RequestMethod.GET });
  }
}
