import { Module } from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CoffeesController } from './coffees.controller';
import { Repository } from 'typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { Coffee, CoffeeSchema } from './entities/coffees.entity';
import { EvenSchema } from '../events/entities/event.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Coffee.name,
        schema: CoffeeSchema,
      },
      {
        name: Event.name,
        schema: EvenSchema,
      },
    ]),
  ],
  providers: [CoffeesService, Repository],
  exports: [],
  controllers: [CoffeesController],
})
export class CoffeesModule {}
