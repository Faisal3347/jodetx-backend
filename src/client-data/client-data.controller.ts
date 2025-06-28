import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';
import { ClientDataService } from './client-data.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('client')
@UseGuards(JwtAuthGuard)
export class ClientDataController {
  constructor(private readonly clientService: ClientDataService) {}

  @Post('add')
  async addClient(@Body() body: any, @Req() req: any) {
    const userId = req.user.sub;
    await this.clientService.addClient(body, userId);
    return {
      message: 'Client info added successfully',
    };
  }

  @Get('my-data')
  async getMyClientData(@Req() req: any) {
    const userId = req.user.sub;
    const data = await this.clientService.getClientDataByUser(userId);
    return {
      message: 'Client data fetched successfully',
      data,
    };
  }
}
