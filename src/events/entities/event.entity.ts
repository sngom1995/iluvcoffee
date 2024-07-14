import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema()
export class Event extends mongoose.Document {
  @Prop()
  name: string;
  @Prop()
  type: string;
  @Prop({ type: mongoose.SchemaTypes.Mixed })
  payload: Record<string, any>;
}

export const EvenSchema = SchemaFactory.createForClass(Event);
