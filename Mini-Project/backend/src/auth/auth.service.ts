import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User, UserRole } from '../entities/user.entity'; // ตรวจสอบ Path ให้ถูกต้อง
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // 1. Register (Hash Password)
  async register(registerDto: RegisterDto): Promise<void> {
    const { email, password, name } = registerDto;

    // Generate Salt และ Hash Password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userRepo.create({
      email,
      password: hashedPassword,
      name,
      role: UserRole.USER, // Default เป็น User เสมอเพื่อความปลอดภัย
    });

    try {
      await this.userRepo.save(user);
    } catch (error) {
      // เช็ค Error Code ของ Postgres (23505 = Unique Violation)
      if (error.code === '23505') {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  // 2. Login (Check Password & Sign Token)
  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { email, password } = loginDto;

    // --- แก้ไขตรงนี้ (สำคัญมาก) ---
    // ใช้ findOne และระบุ select เพื่อดึง password ที่ถูกซ่อนไว้ออกมา
    const user = await this.userRepo.findOne({ 
      where: { email },
      select: ['id', 'email', 'password', 'name', 'role'], // ต้องเลือก field ที่จะใช้ทั้งหมด รวมถึง password
    });

    // ถ้าเจอ User และ Password ตรงกัน (bcrypt.compare)
    // user.password จะไม่เป็น undefined แล้ว เพราะเราสั่ง select มาแล้ว
    if (user && (await bcrypt.compare(password, user.password))) {
      
      // ข้อมูลที่จะฝังใน Token
      const payload = { 
        sub: user.id, 
        email: user.email, 
        role: user.role 
      };

      const accessToken = this.jwtService.sign(payload);
      return { accessToken };
    }

    throw new UnauthorizedException('Invalid credentials');
  }
}