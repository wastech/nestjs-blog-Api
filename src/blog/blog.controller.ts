import {
  Controller,
  Get,
  Post,
  NotFoundException,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { Blog } from './schemas/blog.schema';
import { CreateBlogDto } from './dto/create-blog.dto';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  async create(@Body() blog: CreateBlogDto): Promise<Blog> {
    return this.blogService.create(blog);
  }

  @Get()
  async findAll(): Promise<CreateBlogDto[]> {
    return this.blogService.findAll();
  }

  @Get(':id')
  async getPostById(@Param('id') postId: string): Promise<Blog> {
    const post = await this.blogService.getPostById(postId);
    if (!post) {
      throw new NotFoundException(`Blog post with ID ${postId} not found`);
    }
    return post;
  }

  @Put(':id')
  async updatePostById(
    @Param('id') postId: string,
    @Body() update: Partial<Blog>,
  ): Promise<Blog> {
    const updatedPost = await this.blogService.updatePostById(postId, update);
    if (!updatedPost) {
      throw new NotFoundException(`Blog post with ID ${postId} not found`);
    }
    return updatedPost;
  }

  @Delete(':id')
  async deletePostById(@Param('id') postId: string): Promise<Blog> {
    const deletedPost = await this.blogService.deletePostById(postId);
    if (!deletedPost) {
      throw new NotFoundException(`Blog post with ID ${postId} not found`);
    }
    return deletedPost;
  }
}
