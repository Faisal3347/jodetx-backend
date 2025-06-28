import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClientData, ClientDataDocument } from './client-data.schema';

@Injectable()
export class ClientDataService {
  constructor(
    @InjectModel(ClientData.name) private clientModel: Model<ClientDataDocument>,
  ) {}

  async addClient(data: any, userId: string) {
    const newClient = new this.clientModel({
      ...data,
      userId,
    });
    return await newClient.save();
  }

  
  async getClientDataByUser(userId: string) {
  return await this.clientModel.find({ userId });
}
}
