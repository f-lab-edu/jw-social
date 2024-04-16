import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CounterController } from './counter.controller';
import { CounterService } from './counter.service';
import { Counter } from './entities/counter.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Counter])],
  controllers: [CounterController],
  providers: [CounterService],
})
export class CounterModule {}
