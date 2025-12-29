import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Modules
import { MenusModule } from './menus/menus.module';
import { AuthModule } from './auth/auth.module';

// Entities
import { User } from './entities/user.entity';
import { Product } from './entities/product.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Menu } from './menus/entities/menu.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env', // ระบุชื่อไฟล์ไปเลยตรงๆ
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // --- ส่วน Debug (จะแสดงใน Terminal ตอนรัน) ---
        console.log('====================================');
        console.log('CHECK DATABASE CONFIG:');
        console.log('Host:', configService.get('DB_HOST'));
        console.log('Port:', configService.get('DB_PORT'));
        console.log('Username:', configService.get('DB_USERNAME'));
        // log password แบบนี้เพื่อดู type ว่าเป็น string หรือ number
        const rawPass = configService.get('DB_PASSWORD');
        console.log(`Password: ${rawPass} (Type: ${typeof rawPass})`); 
        console.log('====================================');
        // ---------------------------------------------

        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST', 'localhost'),
          port: configService.get<number>('DB_PORT', 5433),
          username: configService.get<string>('DB_USERNAME'),
          
          // แก้ไขจุดนี้: บังคับแปลงเป็น String เสมอ แก้ปัญหา SASL Error
          password: String(configService.get<string>('DB_PASSWORD') || ''),
          
          database: configService.get<string>('DB_NAME'),
          entities: [User, Product, Order, OrderItem, Menu],
          synchronize: true,
        };
      },
    }),

    MenusModule,
    AuthModule,
  ],
})
export class AppModule {}