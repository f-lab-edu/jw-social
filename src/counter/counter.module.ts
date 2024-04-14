import { Module } from '@nestjs/common';
import { CounterController } from './counter.controller';
import { CounterService } from './counter.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Counter } from './counter.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Counter])],
  controllers: [CounterController],
  providers: [CounterService],
})
export class CounterModule {}
