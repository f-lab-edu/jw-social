import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';

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
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.userService.remove(id);
  }
}
