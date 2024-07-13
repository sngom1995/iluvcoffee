import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCoffeeDto {
  @ApiProperty({ description: 'name of a coffee' })
  @IsString()
  readonly name: string;
  @ApiProperty({ description: 'Brand of coffee' })
  @IsString()
  readonly brand: string;
  @IsString({ each: true })
  readonly flavors: string[];
}
