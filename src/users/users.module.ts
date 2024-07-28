import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PaginationModule } from '@/common/pagination/pagination.module';

import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersGateway } from './users.gateway';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), PaginationModule],
  controllers: [UsersController],
  providers: [UsersService, UsersGateway, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
