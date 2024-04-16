import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Counter } from './entities/counter.entity';

@Injectable()
export class CounterService {
  private static readonly DEFAULT_ID = 1;
  private static readonly INITIAL_VALUE = 0;

  constructor(
    @InjectRepository(Counter)
    private readonly counterRepository: Repository<Counter>,
  ) {}

  async incrementCounter(): Promise<number> {
    const counter = await this.findOrCreateCounter();
    return this.incrementAndSaveCounter(counter);
  }

  async getCounter(): Promise<number> {
    const counter = await this.findOrCreateCounter();
    return counter.value;
  }

  private async findOrCreateCounter(): Promise<Counter> {
    const counter = await this.counterRepository.findOneBy({
      id: CounterService.DEFAULT_ID,
    });
    return counter ?? (await this.createDefaultCounter());
  }

  private async createDefaultCounter(): Promise<Counter> {
    const newCounter = this.counterRepository.create({
      id: CounterService.DEFAULT_ID,
      value: CounterService.INITIAL_VALUE,
    });
    return this.counterRepository.save(newCounter);
  }

  private async incrementAndSaveCounter(counter: Counter): Promise<number> {
    const updatedCounter = { ...counter, value: counter.value + 1 };
    const savedCounter = await this.counterRepository.save(updatedCounter);
    return savedCounter.value;
  }
}
