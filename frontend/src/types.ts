export interface Menu {
  id: number;
  name: string;
  price: number;
  isAvailable: boolean;
  image?: string;
}

// 2. Type ใหม่สำหรับ "ฟอร์มเพิ่มข้อมูล" (เอาทุกอย่างจาก Menu แต่ตัด id ออก)
// *** บรรทัดนี้สำคัญมาก ต้องมีคำว่า export ***
export type CreateMenuDto = Omit<Menu, 'id'>;