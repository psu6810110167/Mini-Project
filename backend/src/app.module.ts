import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenusModule } from './menus/menus.module';
import { Menu } from './menus/entities/menu.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,             
      username: 'admin',      
      password: 'password123', 
      database: 'food_db',     
      entities: [Menu],       
      synchronize: true,      
    }),
    MenusModule,
  ],
})
export class AppModule {}