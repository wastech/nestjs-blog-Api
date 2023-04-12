import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from './schemas/blog.schema';
import { CreateBlogDto } from './dto/create-blog.dto';

@Injectable()
export class BlogService {
  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {}

  async create(createBlogDto: CreateBlogDto): Promise<Blog> {
    const createdBlog = new this.blogModel(createBlogDto);
    return createdBlog.save();
  }

  async findAll(): Promise<Blog[]> {
    return this.blogModel.find().exec();
  }

  async getPostById(postId: string): Promise<Blog> {
    const post = await this.blogModel.findById(postId).exec();
    return post;
  }

  async updatePostById(postId: string, update: Partial<Blog>): Promise<Blog> {
    const post = await this.blogModel
      .findByIdAndUpdate(postId, update, {
        new: true,
      })
      .exec();
    return post;
  }

  async deletePostById(postId: string): Promise<Blog> {
    const deletedPost = await this.blogModel.findByIdAndDelete(postId).exec();
    return deletedPost;
  }
}
