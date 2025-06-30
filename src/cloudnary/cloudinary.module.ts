import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; 
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryController } from './cloudnary.controller';
import { CloudinaryData, CloudinaryDataSchema } from './cloudnary-data.schema';  

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CloudinaryData.name, schema: CloudinaryDataSchema }]),  
  ],
  controllers: [CloudinaryController],
  providers: [CloudinaryService],
})
export class CloudinaryModule {}
