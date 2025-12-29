import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // เพิ่มบรรทัดนี้ครับ เพื่ออนุญาตให้ Frontend ยิงเข้ามาได้
  app.enableCors(); 
  
  // ถ้ามี setGlobalPrefix('api') อยู่แล้วก็ปล่อยไว้ครับ
  // app.setGlobalPrefix('api'); 

  await app.listen(3000);
}
bootstrap();