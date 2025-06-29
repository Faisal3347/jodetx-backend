import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CloudinaryDataDocument = CloudinaryData & Document;

@Schema({ timestamps: true })
export class CloudinaryData {
  @Prop({ required: true })
  userId: string;

  @Prop()
  name: string;

  @Prop()
  dob: string;

  @Prop({ unique: true, required: true })
  aadhaarNumber: string;

  @Prop()
  aadhaarUrl: string;
}

export const CloudinaryDataSchema = SchemaFactory.createForClass(CloudinaryData);
