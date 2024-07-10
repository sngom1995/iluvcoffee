import { Injectable, Module } from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CoffeesController } from './coffees.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coffee } from './entities/coffees.entity';
import { Flavor } from './entities/flavor.entity';
import { Event } from '../events/entities/event.entity';
import { COFFEE_BRANDS } from './constants/coffee.constant';
import { Connection } from 'typeorm';
import { ConfigModule } from '@nestjs/config';

@Injectable()
export class CoffeeBrandFactory {
  create() {
    return ['buddy brew', 'nescafe'];
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event]), ConfigModule],
  providers: [
    CoffeesService,
    CoffeeBrandFactory,
    {
      provide: COFFEE_BRANDS,
      useFactory: async (connection: Connection): Promise<string[]> => {
        const coffeesBrands = await Promise.resolve(['buddy brew', 'nescafe']);
        console.log('Async factory');
        return coffeesBrands;
      },
      inject: [Connection],
    },
  ],
  exports: [CoffeesService],
  controllers: [CoffeesController],
})
export class CoffeesModule {}
