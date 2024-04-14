import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CounterController } from './counter.controller';
import { Counter } from './counter.entity';
import { CounterService } from './counter.service';

@Module({
  imports: [TypeOrmModule.forFeature([Counter])],
  controllers: [CounterController],
  providers: [CounterService],
})
export class CounterModule {}
