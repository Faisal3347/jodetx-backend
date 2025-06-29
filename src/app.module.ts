import { Module } from '@nestjs/common';
import { CloudinaryModule } from './cloudnary/cloudinary.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),  // Make sure your env vars are global
    MongooseModule.forRootAsync({
      imports: [ConfigModule], 
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'), // MongoDB connection URI
      }),
      inject: [ConfigService],
    }),
    CloudinaryModule,  // Import CloudinaryModule here
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
