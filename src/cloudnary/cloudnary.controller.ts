import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Req,
  Logger,
  HttpException,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';
import { Response } from 'express';

@Controller('aadhaar')
export class CloudinaryController {
  private readonly logger = new Logger(CloudinaryController.name);

  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async handleUpload(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
    @Res() res: Response,
  ) {
    const userId = req.body?.userId || 'guest';

    this.logger.log(`File received: ${file?.originalname}`);
    this.logger.log(`User ID: ${userId}`);

    try {
      const result = await this.cloudinaryService.uploadAndExtract(file);

      if (result.status === 'error') {
        return res.status(result.statusCode).json({
          status: result.status,
          message: result.message,
        });
      }

      if (result.status === 'exists') {
        return res.status(result.statusCode).json({
          status: result.status,
          message: result.message,
        });
      }

      const saved = await this.cloudinaryService.addClient(result.data, userId);

      return res.status(result.statusCode).json({
        status: result.status,
        message: 'Aadhaar uploaded and saved successfully.',
        data: saved,
      });
    } catch (error) {
      this.logger.error('Error during upload:', error.message);
      throw new HttpException(
        error.message || 'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
