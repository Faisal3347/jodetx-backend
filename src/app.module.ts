import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CloudinaryModule } from './cloudnary/cloudinary.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),  
    MongooseModule.forRootAsync({
      imports: [ConfigModule], 
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'), 
      }),
      inject: [ConfigService],
    }),
    CloudinaryModule,  
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
