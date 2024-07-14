import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Coffee extends Document {
  @Prop()
  type: string;
  @Prop()
  brand: string;
  @Prop({ index: true })
  name: string;
  @Prop({ default: 0 })
  recommendations: number;
  @Prop([String])
  flavors: string[];
}

export const CoffeeSchema = SchemaFactory.createForClass(Coffee);
