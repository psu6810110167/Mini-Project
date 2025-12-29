import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt'; // 1. Import JwtModuleOptions เพิ่ม
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../entities/user.entity';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      // 2. ระบุ Type ของ Return ว่าเป็น Promise<JwtModuleOptions>
      useFactory: async (configService: ConfigService): Promise<JwtModuleOptions> => {
        return {
          secret: configService.get<string>('JWT_SECRET') || 'secretKey',
          signOptions: {
            // 3. ใช้ as any เพื่อบอก TypeScript ว่า "เชื่อฉันเถอะ ค่านี้ใช้ได้" (แก้ปัญหาเรื่อง Type String/Number)
            expiresIn: (configService.get<string>('JWT_EXPIRATION') || '1d') as any,
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}