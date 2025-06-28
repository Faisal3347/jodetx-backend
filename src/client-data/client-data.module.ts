import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientDataController } from './client-data.controller';
import { ClientDataService } from './client-data.service';
import { ClientData, ClientDataSchema } from './client-data.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ClientData.name, schema: ClientDataSchema }]),
  ],
  controllers: [ClientDataController],
  providers: [ClientDataService],
})
export class ClientDataModule {}
