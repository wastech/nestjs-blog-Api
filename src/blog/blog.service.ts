import { Model } from 'mongoose';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from './entities/blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

@Injectable()
export class BlogService {
  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {}

  async create(createBlogDto: CreateBlogDto, user: JwtPayload): Promise<Blog> {
    const createdBlog = new this.blogModel({
      ...createBlogDto,
      user: user._id, // set the author to the user ID from the JWT payload
    });

    return createdBlog.save();
  }

  // async findAll(): Promise<Blog[]> {
  //   return this.blogModel.find().exec();
  // }
  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit; // calculate how many posts to skip based on page and limit
    const total = await this.blogModel.countDocuments(); // get the total number of posts
    const blogs = await this.blogModel.find().skip(skip).limit(limit).exec(); // get the posts for the current page

    return {
      data: blogs,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
    };
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

  async getRelatedBlogs(blogSlug: string): Promise<Blog[]> {
    const currentBlog = await this.blogModel.findOne({ slug: blogSlug });
    if (!currentBlog) {
      return [];
    }
    const relatedBlogs = await this.blogModel
      .find({
        category: currentBlog.category,
        title: { $regex: new RegExp(currentBlog.title, 'i') },
        slug: { $ne: currentBlog.slug },
        _id: { $ne: currentBlog._id },
      })
      .limit(5);
    return relatedBlogs;
  }

  async deletePostById(postId: string) {
    const deletedPost = await this.blogModel
      .findByIdAndDelete(postId)
      .populate('user')
      .exec();

    return deletedPost;
  }

  async upvoteBlog(blogId: string, userId: string): Promise<Blog> {
    const blog = await this.blogModel.findById(blogId);

    if (!blog) {
      throw new NotFoundException(`Blog with id ${blogId} not found`);
    }

    if (blog.upvotes.includes(userId)) {
      throw new BadRequestException('User has already upvoted this blog');
    }

    if (blog.downvotes.includes(userId)) {
      blog.downvotes = blog.downvotes.filter((id) => id !== userId);
    }

    blog.upvotes.push(userId);
    return blog.save();
  }

  async downvoteBlog(blogId: string, userId: string): Promise<Blog> {
    const blog = await this.blogModel.findById(blogId);

    if (!blog) {
      throw new NotFoundException(`Blog with id ${blogId} not found`);
    }
    
    // Check if the user has already downvoted the post
    if (blog.downvotes.includes(userId)) {
      throw new BadRequestException('User has already downvoted this blog');
    }
  
    // Remove the user's ID from the upvotes array (if it exists)
    blog.upvotes = blog.upvotes.filter((id) => id !== userId);
  
    // Add the user's ID to the downvotes array
    blog.downvotes.push(userId);
  
    return await blog.save();
  }


  async findByUserId(userId: string): Promise<Blog[]> {
    return this.blogModel.find({ user: userId }).exec();
  }

  async findByCategory(categoryName: string): Promise<Blog[]> {
    return this.blogModel.find({ category: categoryName }).exec();
  }



}
