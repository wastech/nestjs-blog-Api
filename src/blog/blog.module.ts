import { Module } from '@nestjs/common';
import { BlogsService } from './blog.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsController } from './blog.controller';
import { Blog, BlogSchema } from './entities/blog.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }])],
  controllers: [BlogsController],
  providers: [BlogsService]
})
export class BlogModule {}
