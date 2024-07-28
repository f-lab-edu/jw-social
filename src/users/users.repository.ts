import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { User } from './entities/user.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async create(user: Partial<User>): Promise<User> {
    const newUser = this.usersRepository.create(user);
    return await this.usersRepository.save(newUser);
  }

  async createMany(users: Partial<User>[]): Promise<User[]> {
    const newUsers = this.usersRepository.create(users);
    return await this.usersRepository.save(newUsers);
  }

  async findAll(pageToken: string, maxPageSize: number): Promise<User[]> {
    const query = this.usersRepository.createQueryBuilder('user');

    if (pageToken) {
      query.where('user.id > :pageToken', { pageToken });
    }

    query.orderBy('user.id', 'ASC').take(maxPageSize);

    query.cache(true, 60000);

    return await query.getMany();
  }

  async findOne(id: string): Promise<User | null> {
    return await this.usersRepository.findOneBy({ id });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOneBy({ email });
  }

  async update(user: Partial<User>): Promise<User> {
    return await this.usersRepository.save(user);
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.usersRepository.delete(id);
  }
}
