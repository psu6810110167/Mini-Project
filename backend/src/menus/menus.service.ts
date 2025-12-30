import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Menu } from './entities/menu.entity';

@Injectable()
export class MenusService {
  // 1. ฉีด Repository เข้ามาใช้งาน
  constructor(
    @InjectRepository(Menu)
    private menusRepository: Repository<Menu>,
  ) {}

  // 2. แก้ฟังก์ชัน create (ให้บันทึกจริง)
  create(createMenuDto: CreateMenuDto) {
    return this.menusRepository.save(createMenuDto);
  }

  // 3. แก้ฟังก์ชัน findAll (ให้ดึงข้อมูลจริง)
  findAll() {
    return this.menusRepository.find(); 
    // เดิมมันเขียนว่า return `This action returns all menus`; ให้ลบทิ้งเลย
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