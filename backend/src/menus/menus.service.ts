import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from './entities/menu.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MenusService {
  constructor(
    @InjectRepository(Menu)
    private menusRepository: Repository<Menu>,
  ) {}

  // ฟังก์ชันเพิ่มเมนู (แก้ไขใหม่)
  async create(createMenuDto: CreateMenuDto) {
    // 1. เช็คก่อนว่ามีชื่อนี้หรือยัง
    const existingMenu = await this.menusRepository.findOne({ 
      where: { name: createMenuDto.name } 
    });

    // 2. ถ้ามีแล้ว ให้โยน Error กลับไปบอก Frontend
    if (existingMenu) {
      throw new BadRequestException('❌ ชื่อเมนูนี้มีอยู่แล้วครับ กรุณาเปลี่ยนชื่อใหม่');
    }

    // 3. ถ้าไม่ซ้ำ ก็บันทึกตามปกติ
    return this.menusRepository.save(createMenuDto);
  }

  findAll() {
    return this.menusRepository.find();
  }

  findOne(id: number) {
    return this.menusRepository.findOneBy({ id });
  }

  update(id: number, updateMenuDto: UpdateMenuDto) {
    return this.menusRepository.update(id, updateMenuDto);
  }

  remove(id: number) {
    return this.menusRepository.delete(id);
  }
}