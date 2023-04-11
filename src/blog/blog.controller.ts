import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { BlogsService } from './blog.service';
import { Blog } from './entities/blog.entity';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Post()
  async create(@Body() blog: Blog): Promise<Blog> {
    return this.blogsService.create(blog);
    }
    
    @Get()
    async findAll(): Promise<Blog[]> {
    return this.blogsService.findAll();
    }
    
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Blog> {
    return this.blogsService.findOne(id);
    }
    
    @Put(':id')
    async update(
    @Param('id') id: string,
    @Body() blog: Blog,
    ): Promise<Blog> {
    return this.blogsService.update(id, blog);
    }
    
    @Delete(':id')
    async remove(@Param('id') id: string): Promise<Blog> {
    return this.blogsService.remove(id);
    }
    }