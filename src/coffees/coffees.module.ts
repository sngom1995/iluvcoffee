import { Module } from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CoffeesController } from './coffees.controller';

@Module({
  imports: [],
  providers: [CoffeesService],
  exports: [],
  controllers: [CoffeesController],
})
export class CoffeesModule {}
