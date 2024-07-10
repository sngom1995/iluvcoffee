import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { Coffee } from './entities/coffees.entity';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Flavor } from './entities/flavor.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { Event } from '../events/entities/event.entity';
import { COFFEE_BRANDS } from './constants/coffee.constant';

@Injectable()
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly flavorsRepository: Repository<Flavor>,
    private readonly dataSource: DataSource,
    @Inject(COFFEE_BRANDS) private coffeeBrands: string[],
  ) {
    console.log('CoffeeService instanciated');
  }

  async findAll(paginationDto: PaginationQueryDto): Promise<Coffee[]> {
    const { limit, offset } = paginationDto;

    return await this.coffeeRepository.find({
      relations: {
        flavors: true,
      },
      skip: offset,
      take: limit,
    });
  }

  async findOne(id: number): Promise<Coffee> {
    const coffee = await this.coffeeRepository.findOne({ where: { id: id } });
    if (!coffee) {
      throw new NotFoundException(`Coffee with id: ${id} not found`);
    }
    return coffee;
  }

  async save(coffee: CreateCoffeeDto): Promise<Coffee> {
    const flavors = await Promise.all(
      coffee.flavors.map((name) => this.preloadFlavorByName(name)),
    );
    const createCoffe = { ...coffee, flavors };
    const coffeeSaved = await this.coffeeRepository.create(createCoffe);
    return await this.coffeeRepository.save(coffeeSaved);
  }

  async recommendCoffee(coffee: Coffee) {
    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      coffee.recommendations++;
      const recommendEvent = new Event();
      recommendEvent.name = 'recommend_coffee';
      recommendEvent.type = 'coffee';
      recommendEvent.payload = { coffeeId: coffee.id };
      await queryRunner.manager.save(coffee);
      await queryRunner.manager.save(recommendEvent);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
  async remove(id: number): Promise<void> {
    const coffee = await this.findOne(id);
    await this.coffeeRepository.remove(coffee);
  }

  async update(id: number, updateCoffeeDto: CreateCoffeeDto): Promise<void> {
    const flavors = await Promise.all(
      updateCoffeeDto.flavors.map((name) => this.preloadFlavorByName(name)),
    );
    const updateCoffe = { ...updateCoffeeDto, flavors };
    const coffee = await this.coffeeRepository.preload({
      id: id,
      ...updateCoffe,
    });
    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    await this.coffeeRepository.save(coffee);
  }

  private async preloadFlavorByName(name: string) {
    const flavorExist = await this.flavorsRepository.findOne({
      where: {
        name,
      },
    });
    if (flavorExist) {
      return flavorExist;
    }
    return this.flavorsRepository.create({ name });
  }
}
