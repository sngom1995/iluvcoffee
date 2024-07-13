import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  SetMetadata,
} from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';

import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { Public } from '../common/decorators/public.decorator';

@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeesService: CoffeesService) {
    console.log('controller created');
  }

  @Public()
  @Get()
  async findAll(@Query() paginationQuery: PaginationQueryDto) {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    return await this.coffeesService.findAll(paginationQuery);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.coffeesService.findOne(parseInt(id));
  }

  @Post()
  async save(@Body() coffee: CreateCoffeeDto) {
    return this.coffeesService.save(coffee);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.coffeesService.remove(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: CreateCoffeeDto) {
    return this.coffeesService.update(+id, body);
  }
}
