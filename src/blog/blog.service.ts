import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog } from './entities//blog.entity';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel('Blog') private readonly blogModel: Model<Blog>,
  ) {}

  async create(blog: Blog): Promise<Blog> {
    const createdProduct = new this.blogModel(blog);
    return createdProduct.save();
  }

  async findAll(): Promise<Blog[]> {
    return this.blogModel.find().exec();
  }

  async findOne(id: string): Promise<Blog> {
    return this.blogModel.findById(id).exec();
  }

  async update(id: string, product: Blog): Promise<Blog> {
    return this.blogModel.findByIdAndUpdate(id, product, { new: true });
  }

  async remove(id: string): Promise<Blog> {
    return this.blogModel.findByIdAndRemove(id);
  }
}
