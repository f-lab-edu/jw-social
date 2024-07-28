import { Injectable } from '@nestjs/common';
import { genSalt, hash } from 'bcrypt';
import { DeleteResult } from 'typeorm';

import { PaginationService } from '@/common/pagination';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { EmailAlreadyExistsException, UserNotFoundException } from './errors';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly paginationService: PaginationService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, email, password } = createUserDto;

    const existingUser = await this.usersRepository.findOneByEmail(email);
    if (existingUser) {
      throw new EmailAlreadyExistsException();
    }

    const hashedPassword = await this.hashPassword(password);

    const newUser = {
      username,
      email,
      password: hashedPassword,
    };

    return await this.usersRepository.create(newUser);
  }

  async createMany(users: Partial<User>[]): Promise<User[]> {
    return await this.usersRepository.createMany(users);
  }

  async findAll(
    pageToken: string = '',
    maxPageSize: number = 10,
  ): Promise<{ results: User[]; nextPageToken: string }> {
    const validatedMaxPageSize =
      this.paginationService.validateAndNormalizePageSize(maxPageSize);

    const users = await this.usersRepository.findAll(
      pageToken,
      validatedMaxPageSize,
    );

    const nextPageToken = this.paginationService.getNextPageToken(
      users,
      validatedMaxPageSize,
      (user) => user.id,
    );

    return {
      results: users,
      nextPageToken,
    };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne(id);

    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOne(id);

    if (!user) {
      throw new UserNotFoundException();
    }

    const updatedUser = {
      ...user,
      ...updateUserDto,
    };

    return await this.usersRepository.update(updatedUser);
  }

  async remove(id: string): Promise<void> {
    const result: DeleteResult = await this.usersRepository.delete(id);
    if (!result.affected) {
      throw new UserNotFoundException();
    }
  }

  async validatePassword(
    enteredPassword: string,
    storedPasswordHash: string,
  ): Promise<boolean> {
    return (
      (await hash(enteredPassword, storedPasswordHash)) === storedPasswordHash
    );
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await genSalt();
    return await hash(password, salt);
  }
}
