import { Controller, Get, Post, Body, Patch, Delete } from '@nestjs/common';

import { UUIDParam } from 'src/common/decorators/parse-uuid.decorator';

import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@UUIDParam() id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  update(@UUIDParam() id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  remove(@UUIDParam() id: string) {
    return this.postsService.remove(id);
  }
}
