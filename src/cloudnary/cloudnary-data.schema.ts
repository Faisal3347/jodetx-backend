import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CloudinaryDataDocument = CloudinaryData & Document; // This defines the type for documents

@Schema()
export class CloudinaryData {
  @Prop()
  name: string;  // Extracted name from the Aadhaar card

  @Prop()
  dob: string;   // Extracted Date of Birth from Aadhaar card

  @Prop()
  aadhaarNumber: string;  // Extracted Aadhaar number

  @Prop()
  aadhaarUrl: string;  // Cloudinary URL of the Aadhaar card image

  @Prop()
  userId: string;  // Associated user ID to link data with the user

  @Prop({ default: Date.now })
  createdAt: Date;  // Timestamp of the data creation
}

export const CloudinaryDataSchema = SchemaFactory.createForClass(CloudinaryData); // Create schema from class
