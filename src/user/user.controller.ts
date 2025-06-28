import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() body: any) {
    return this.userService.register(body);
  }

  @Post('login')
  async login(@Body() body: any) {
    return this.userService.login(body);
  }
}
