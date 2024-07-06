import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Coffee } from './entities/coffees.entity';
import { CreateCoffeeDto } from './dto/create-coffee.dto';

@Injectable()
export class CoffeesService {
  private coffees: Coffee[] = [
    {
      id: 1,
      name: 'Shipwreck',
      brand: 'Buddy Brew',
      flavors: ['Chocolate', 'Vanilla'],
    },
  ];

  findAll(): Coffee[] {
    return this.coffees;
  }

  findOne(id: number): Coffee {
    const coffee = this.coffees.find((coffee) => coffee.id === id);
    if (!coffee) {
      throw new NotFoundException(`Coffee with id: ${id} not found`);
    }
    return this.coffees.find((coffee) => coffee.id === id);
  }

  save(coffee: CreateCoffeeDto): Coffee {
    const coffeeToCreate = { id: this.coffees.length + 1, ...coffee };

    this.coffees.push(coffeeToCreate);
    return coffeeToCreate;
  }
  remove(id: number): void {
    const coffee = this.coffees.find((coffee) => coffee.id === id);
    if (!coffee) {
      throw new HttpException(
        `Coffee with id : ${id} does not does not exist`,
        HttpStatus.BAD_REQUEST,
      );
    }
    this.coffees = this.coffees.filter((coffee) => coffee.id !== id);
  }

  update(id: number, coffee: Coffee): void {}
}
