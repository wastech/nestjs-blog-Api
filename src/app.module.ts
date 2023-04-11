import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AppService } from './app.service';
import { BlogModule } from './blog/blog.module';
import { mongooseConfig } from './database/mongoose.config';

@Module({
  imports: [BlogModule, mongooseConfig()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
