import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ClientDataDocument = ClientData & Document;

@Schema()
export class ClientData {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  dob: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  aadhaarNumber: string;

  @Prop({ required: true })
  userId: string; // Foreign key to User ID
}

export const ClientDataSchema = SchemaFactory.createForClass(ClientData);
