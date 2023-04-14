import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AppService } from './app.service';
import { BlogModule } from './blog/blog.module';
import { APP_FILTER } from '@nestjs/core';
import { AnyExceptionFilter   } from './http-exception.filter';
import { mongooseConfig } from './database/mongoose.config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [BlogModule, mongooseConfig(), AuthModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AnyExceptionFilter ,
    },
  ],
})
export class AppModule {}
