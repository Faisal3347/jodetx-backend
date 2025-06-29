import { Controller, Post, UseInterceptors, UploadedFile, Req, Logger } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';
import { ClientDataService } from '../client-data/client-data.service';

@Controller('aadhaar')
export class CloudinaryController {
  private readonly logger = new Logger(CloudinaryController.name);

  constructor(
    private cloudinaryService: CloudinaryService,
    private clientDataService: ClientDataService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async handleUpload(@UploadedFile() file: Express.Multer.File, @Req() req) {
    this.logger.log('File received:', file);

    const userId = req.user ? req.user.userId : 'guest';  

    this.logger.log(`User ID: ${userId}`);

    try {
      const extracted = await this.cloudinaryService.uploadAndExtract(file);
      this.logger.log('Extracted data:', extracted);

      const saved = await this.clientDataService.addClient(extracted, userId);
      this.logger.log('Saved data:', saved);

      return saved;
    } catch (error) {
      this.logger.error('Error during file processing:', error);
      throw error;
    }
  }
}
