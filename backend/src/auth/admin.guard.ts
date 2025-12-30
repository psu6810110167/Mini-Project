import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    
    // ดึงค่าจาก Header ที่ชื่อ 'admin-secret'
    const secret = request.headers['admin-secret'];

    // ตรวจสอบว่ารหัสตรงกับที่เราตั้งไว้ไหม (ในที่นี้ตั้งเป็น 'MY_SUPER_SECRET_PASSWORD')
    if (secret === 'admin') {
      return true; // อนุญาตให้ผ่าน
    }

    // ถ้าไม่ตรง ให้ดีดกลับไปเลย
    throw new UnauthorizedException('คุณไม่มีสิทธิ์! เฉพาะ Admin เท่านั้น');
  }
}