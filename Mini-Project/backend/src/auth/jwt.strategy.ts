import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity'; // <-- Error ที่ 1 จะหายไปถ้าสร้างไฟล์แล้ว

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // แก้บรรทัดด้านล่างนี้ครับ
      secretOrKey: configService.get<string>('JWT_SECRET') || 'secretKey', 
    });
  }

  async validate(payload: any) {
    const { sub: id } = payload;
    const user = await this.userRepo.findOneBy({ id });

    if (!user) {
      throw new UnauthorizedException();
    }
    return { id: user.id, email: user.email, role: user.role };
  }
}