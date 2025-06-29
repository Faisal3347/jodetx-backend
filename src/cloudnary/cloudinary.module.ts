import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';  // Ensure MongooseModule is imported
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryController } from './cloudnary.controller';
import { CloudinaryData, CloudinaryDataSchema } from './cloudnary-data.schema';  // Import schema here
import { ClientDataService } from '../client-data/client-data.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CloudinaryData.name, schema: CloudinaryDataSchema }]),  // Register the model
  ],
  controllers: [CloudinaryController],
  providers: [CloudinaryService, ClientDataService],
})
export class CloudinaryModule {}
