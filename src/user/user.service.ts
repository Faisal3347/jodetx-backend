import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(dto: any): Promise<{ message: string }> {
    const { name, phoneNumber, password, confirmPassword } = dto;

    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const existingUser = await this.userModel.findOne({ phoneNumber });
    if (existingUser) {
      throw new BadRequestException('Phone number already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new this.userModel({
      name,
      phoneNumber,
      password: hashedPassword,
    });

    await user.save();

    return { message: 'User created successfully' };
  }

  async login(dto: any): Promise<{ token: string }> {
    const { phoneNumber, password } = dto;

    const user = await this.userModel.findOne({ phoneNumber });
    if (!user) {
      throw new UnauthorizedException('Invalid phone number or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid phone number or password');
    }

    const payload = { sub: user._id, phoneNumber: user.phoneNumber };
    const token = this.jwtService.sign(payload);

    return { token };
  }
}
