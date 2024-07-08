import { DataSource } from 'typeorm';
import { CoffeeRefactor1720378527608 } from './src/migrations/1720378527608-CoffeeRefactor';
import { Coffee } from './src/coffees/entities/coffees.entity';
import { Flavor } from './src/coffees/entities/flavor.entity';
import { Event } from './src/events/entities/event.entity';
import { SchemaSync1720380030967 } from './src/migrations/1720380030967-SchemaSync';
export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'samba',
  password: 'passer123',
  database: 'postgres',
  entities: [Coffee, Flavor, Event],
  migrations: [CoffeeRefactor1720378527608, SchemaSync1720380030967],
});
