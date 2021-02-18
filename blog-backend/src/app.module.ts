import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DBModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { BlogModule } from './blog/blog.module';
import { FileModule } from './file/file.module';

@Module({
  imports: [DBModule, UserModule, BlogModule, FileModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
