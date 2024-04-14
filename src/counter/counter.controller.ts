import { Controller, Get, Post } from '@nestjs/common';
import { CounterService } from './counter.service';

@Controller('counter')
export class CounterController {
  constructor(private readonly counterService: CounterService) {}

  @Post('increment')
  increment(): Promise<number> {
    return this.counterService.incrementCounter();
  }

  @Get('current')
  getCurrentCounter(): Promise<number> {
    return this.counterService.getCounter();
  }
}
