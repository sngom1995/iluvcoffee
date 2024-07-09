import { Injectable, Module } from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CoffeesController } from './coffees.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coffee } from './entities/coffees.entity';
import { Flavor } from './entities/flavor.entity';
import { Event } from '../events/entities/event.entity';
import { COFFEE_BRANDS } from './constants/coffee.constant';

@Injectable()
export class CoffeeBrandFactory {
  create() {
    return ['buddy brew', 'nescafe'];
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])],
  providers: [
    CoffeesService,
    CoffeeBrandFactory,
    {
      provide: COFFEE_BRANDS,
      useFactory: (coffeeBrands: CoffeeBrandFactory) => coffeeBrands.create(),
      inject: [CoffeeBrandFactory],
    },
  ],
  exports: [CoffeesService],
  controllers: [CoffeesController],
})
export class CoffeesModule {}
