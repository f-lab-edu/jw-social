import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { genSalt, hash } from 'bcrypt';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { EmailAlreadyExistsException, UserNotFoundException } from './errors';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, email, password } = createUserDto;

    const existingUser = await this.usersRepository.findOneBy({
      email,
    });
    if (existingUser) {
      throw new EmailAlreadyExistsException();
    }

    const hashedPassword = await this.hashPassword(password);

    const newUser = this.usersRepository.create({
      username,
      email,
      password: hashedPassword,
    });

    return await this.usersRepository.save(newUser);
  }

  async createMany(users: Partial<User>[]): Promise<User[]> {
    const newUsers = this.usersRepository.create(users);
    return await this.usersRepository.save(newUsers);
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.preload({
      id,
      ...updateUserDto,
    });

    if (!user) {
      throw new UserNotFoundException();
    }

    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
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
