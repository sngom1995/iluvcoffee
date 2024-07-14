import { Injectable, NotFoundException } from '@nestjs/common';
import { Coffee } from './entities/coffees.entity';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { connection, Connection, Model } from 'mongoose';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { Event } from '../events/entities/event.entity';

@Injectable()
export class CoffeesService {
  constructor(
    @InjectModel(Coffee.name)
    private readonly coffeeModel: Model<Coffee>,
    @InjectConnection()
    private readonly connection: Connection,
    @InjectModel(Event.name)
    private readonly eventModel: Model<Event>,
  ) {}

  async findAll(paginationQuery: PaginationQueryDto): Promise<Coffee[]> {
    const { limit, offset } = paginationQuery;
    return this.coffeeModel.find().skip(offset).limit(limit).exec();
  }

  async findOne(id: string): Promise<Coffee> {
    const coffee = await this.coffeeModel.findOne({ _id: id });
    if (!coffee) {
      throw new NotFoundException(`Coffee with id: ${id} not found`);
    }
    return coffee;
  }

  async save(coffee: CreateCoffeeDto): Promise<Coffee> {
    return this.coffeeModel.create(coffee);
  }

  async update(id: string, updateCoffeeDto: CreateCoffeeDto): Promise<Coffee> {
    const existingCoffee = await this.coffeeModel
      .findByIdAndUpdate({ _id: id }, { $set: updateCoffeeDto }, { new: true })
      .exec();
    if (!existingCoffee) {
      throw new NotFoundException(`Coffee with id: ${id} not found`);
    }
    return existingCoffee.save();
  }

  async delete(id: string) {
    await this.coffeeModel.deleteOne({ _id: id }).exec();
  }
  async recommendCoffee(coffee: Coffee) {
    const session = await connection.startSession();
    session.startTransaction();
    try {
      coffee.recommendations++;
      const recommendEvent = new this.eventModel({
        name: 'recommend_coffee',
        type: 'coffee',
        payload: { coffeeId: coffee.id },
      });
      await recommendEvent.save({ session });
      await coffee.save({ session });
      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
    } finally {
      await session.endSession();
    }
  }
}
