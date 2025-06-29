import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CloudinaryData, CloudinaryDataDocument } from './cloudnary-data.schema';
import * as Tesseract from 'tesseract.js';
import { v2 as cloudinary } from 'cloudinary';
const sharp = require('sharp');

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  constructor(
    @InjectModel(CloudinaryData.name)
    private readonly cloudinaryDataModel: Model<CloudinaryDataDocument>,
  ) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadAndExtract(file: Express.Multer.File): Promise<any> {
    if (!file || !file.buffer) {
      return {
        status: 'error',
        statusCode: 400,
        message: 'File is missing or invalid.',
      };
    }

    // Step 1: Preprocess image
    const processedImage = await sharp(file.buffer)
      .resize({ width: 1000 })
      .grayscale()
      .toBuffer();

    // Step 2: OCR processing
    const { data: { text } } = await Tesseract.recognize(processedImage, 'eng');
    this.logger.log(`Extracted Text: ${text}`);

    // Step 3: Field Extraction
    const dobMatch = text.match(/(\d{2}\/\d{2}\/\d{4})/);
    const aadhaarMatch = text.match(/(\d{4}\s\d{4}\s\d{4})/);
    const aadhaarNumber = aadhaarMatch?.[1]?.replace(/\s/g, '') || '';
    const isAadhaar = /Government of India|Unique Identification Authority/i.test(text);

    if (!aadhaarMatch || !isAadhaar) {
      return {
        status: 'error',
        statusCode: 422,
        message: 'Invalid document. Aadhaar number not found or document not recognized as Aadhaar.',
      };
    }

    const existing = await this.cloudinaryDataModel.findOne({ aadhaarNumber });
    if (existing) {
      this.logger.warn(`Aadhaar already exists: ${aadhaarNumber}`);
      return {
        status: 'exists',
        statusCode: 200,
        message: 'Aadhaar already exists in the system.',
        data: existing,
      };
    }

    // Step 5: Upload to Cloudinary
    const uploadRes = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'aadhaar' },
        (error, result) => {
          if (error || !result) return reject(error || new Error('Upload failed'));
          resolve(result);
        },
      ).end(file.buffer);
    });

    const imageUrl = (uploadRes as any).secure_url;

    // Step 6: Return data
    return {
      status: 'success',
      statusCode: 201,
      message: 'Aadhaar extracted and ready to save.',
      data: {
        dob: dobMatch?.[1] || '',
        aadhaarNumber,
        aadhaarUrl: imageUrl,
      },
    };
  }

  async addClient(data: any, userId: string) {
    const newClient = new this.cloudinaryDataModel({
      userId,
      ...data,
    });

    this.logger.log(`Saving data for userId=${userId}`);

    return await newClient.save();
  }


async findAll() {
  return this.cloudinaryDataModel.find().exec();
}

}
