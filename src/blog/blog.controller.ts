import {
  Controller,
  Get,
  Post,
  NotFoundException,
  Body,
  Param,
  Request,
  UseGuards,
  Put,
  Req,
  Delete,
  Query,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { Blog } from './entities/blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/auth/entities/auth.entity';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CanDeletePostGuard } from './can-delete-post.guard';
import { CanUpdatePostGuard } from './can-update-post.guard';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.Admin, Role.User)
  async create(@Body() createBlogDto: CreateBlogDto, @Request() req) {
    return this.blogService.create(createBlogDto, req.user);
  }

  @Get()
  @Public()
  async getAll(@Query('page') page: number, @Query('limit') limit: number) {
    return this.blogService.findAll(page, limit);
  }

  @Get(':id')
  @Public()
  async getPostById(@Param('id') postId: string): Promise<Blog> {
    const post = await this.blogService.getPostById(postId);
    if (!post) {
      throw new NotFoundException(`Blog post with ID ${postId} not found`);
    }
    return post;
  }

  @Put(':id')
  @UseGuards(CanUpdatePostGuard)
  @Roles(Role.Admin)
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
  @UseGuards(CanDeletePostGuard)
  @Roles(Role.Admin)
  // apply the delete guard to this endpoint
  async deletePostById(@Param('id') postId: string) {
    const deletedPost = await this.blogService.deletePostById(postId);
    if (!deletedPost) {
      throw new NotFoundException(`Blog post with ID ${postId} not found`);
    }
    return {
      message: `User ${postId} has been deleted successfully!`,
    };
  }

  @Public()
  @Get('related/:blogSlug')
  async getRelatedBlogs(@Param('blogSlug') slug: string): Promise<Blog[]> {
    return this.blogService.getRelatedBlogs(slug);
  }

  @Post(':blogId/upvote')
  async upvoteBlog(
    @Param('blogId') blogId: string,
    @Request() req,
  ): Promise<Blog> {
    const userId = req.user.id;
    return this.blogService.upvoteBlog(blogId, userId);
  }

  @Post(':blogId/downvote')
  async downvoteBlog(
    @Param('blogId') blogId: string,
    @Request() req,
  ): Promise<Blog> {
    const userId = req.user.id;
    return this.blogService.downvoteBlog(blogId, userId);
  }

  @Get('user/:userId')
  async getBlogsByUser(@Param('userId') userId: string): Promise<Blog[]> {
    return this.blogService.findByUserId(userId);
  }

  @Get('category/:categoryName')
  async getBlogsByCategory(
    @Param('categoryName') categoryName: string,
  ): Promise<Blog[]> {
    return this.blogService.findByCategory(categoryName);
  }
}
