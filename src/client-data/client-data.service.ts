import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CloudinaryData,
  CloudinaryDataDocument,
} from '../cloudnary/cloudnary-data.schema';

@Injectable()
export class ClientDataService {
  constructor(
    @InjectModel(CloudinaryData.name)
    private cloudinaryDataModel: Model<CloudinaryDataDocument>,
  ) {}

  async addClient(data: any, userId: string) {
    const newClient = new this.cloudinaryDataModel({
      ...data,
      userId,
    });
    return await newClient.save();
  }

  async getClientDataByUser(userId: string) {
    return await this.cloudinaryDataModel.find({ userId });
  }
}
