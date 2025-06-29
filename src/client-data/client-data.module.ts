import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientDataService } from './client-data.service';
import { CloudinaryData, CloudinaryDataSchema } from '../cloudnary/cloudnary-data.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CloudinaryData.name, schema: CloudinaryDataSchema },
    ]),
  ],
  providers: [ClientDataService],
  exports: [ClientDataService],
})
export class ClientDataModule {}
