import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Menu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true }) // 👈 เพิ่ม { unique: true } ตรงนี้ครับ (ห้ามชื่อซ้ำเด็ดขาด)
  name: string;

  @Column('decimal')
  price: number;

  @Column({ nullable: true })
  image: string;

  @Column({ default: true })
  isAvailable: boolean;
}