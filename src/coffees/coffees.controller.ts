import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';

import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { Public } from '../common/decorators/public.decorator';
import { ParseIntPipe } from '../common/pipe/parse-int.pipe';
import { Protocol } from '../common/decorators/protocol.decorator';
import { ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('coffees')
@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeesService: CoffeesService) {
    console.log('controller created');
  }

  @ApiForbiddenResponse({ description: 'Forbidden' })
  @Public()
  @Get()
  async findAll(
    @Protocol('https') protocol: string,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    console.log(protocol);
    return await this.coffeesService.findAll(paginationQuery);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: string) {
    console.log(id);
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
