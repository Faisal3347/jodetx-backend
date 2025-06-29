import * as Tesseract from 'tesseract.js';
import { v2 as cloudinary } from 'cloudinary';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CloudinaryService {
  cloudinaryDataModel: any;
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadAndExtract(file: Express.Multer.File): Promise<any> {
    const uploadRes = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'aadhaar' },
        (error, result) => {
          if (error || !result) return reject(error || new Error('No result'));
          resolve(result);
        },
      ).end(file.buffer);
    });

    const imageUrl = (uploadRes as any).secure_url;

    const { data: { text } } = await Tesseract.recognize(file.buffer, 'eng');

    console.log('Extracted text:', text);

    // Use Regex to Extract Data
    const nameMatch = text.match(/(?<=Name[\s:]*)([A-Z ]+)/i);
    const dobMatch = text.match(/(\d{2}\/\d{2}\/\d{4})/);
    const aadhaarMatch = text.match(/(\d{4}\s\d{4}\s\d{4})/);

    return {
      name: nameMatch?.[1]?.trim() || '',
      dob: dobMatch?.[1] || '',
      aadhaarNumber: aadhaarMatch?.[1]?.replace(/\s/g, '') || '',
      aadhaarUrl: imageUrl,
    };
  }

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
