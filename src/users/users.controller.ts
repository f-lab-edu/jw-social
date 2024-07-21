import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
} from '@nestjs/common';

import { UUIDParam } from '@/common/decorators/parse-uuid.decorator';
import { PaginationDto } from '@/common/pagination';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<{ results: User[]; nextPageToken: string }> {
    const { pageToken, maxPageSize } = paginationDto;
    const { results, nextPageToken } = await this.userService.findAll(
      pageToken,
      maxPageSize ? Number(maxPageSize) : undefined,
    );

    return {
      results,
      nextPageToken,
    };
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  findOne(@UUIDParam() id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':id')
  update(
    @UUIDParam() id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(':id')
  remove(@UUIDParam() id: string): Promise<void> {
    return this.userService.remove(id);
  }
}
