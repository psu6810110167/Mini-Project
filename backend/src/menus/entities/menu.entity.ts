import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Menu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // ชื่อเมนู (เช่น ข้าวกะเพรา)

  @Column('decimal')
  price: number; // ราคา

  @Column({ nullable: true })
  image: string; // URL รูปภาพ (ถ้ามี)

  @Column({ default: true })
  isAvailable: boolean; // มีของไหม
}