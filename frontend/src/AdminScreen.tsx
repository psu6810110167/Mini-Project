import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from './context/AuthContext'; // เรียกใช้สมอง (Context)
import './AdminScreen.css'; // อย่าลืมสร้างไฟล์ CSS นี้นะครับ (มีโค้ดด้านล่าง)

// กำหนด Type ของข้อมูลที่จะส่งไป Backend
interface CreateMenuDto {
  name: string;
  price: number;
  isAvailable: boolean;
  image: string;
}

const AdminScreen: React.FC = () => {
  // 1. ดึงข้อมูลจากระบบ Login (รหัสลับ + ฟังก์ชัน Logout)
  const { adminSecret, logout } = useAuth();
  
  const [formData, setFormData] = useState<CreateMenuDto>({
    name: '',
    price: 0,
    isAvailable: true,
    image: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // ฟังก์ชันจัดการ input เปลี่ยนค่า
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'price' ? Number(value) : value)
    }));
  };

  // ฟังก์ชันกดปุ่มบันทึก
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || formData.price <= 0) {
      alert('⚠️ กรุณากรอกชื่อและราคาให้ถูกต้อง');
      return;
    }

    try {
      setIsLoading(true);
      
      // 2. ยิง API โดยแปะ 'admin-secret' ไปที่ Header อัตโนมัติ
      await axios.post('http://localhost:3000/api/menus', formData, {
        headers: {
          'admin-secret': adminSecret // <--- รหัสลับมาจาก Context ไม่ต้องกรอกเอง
        }
      });
      
      alert('✅ เพิ่มเมนูสำเร็จเรียบร้อย!');
      
      // รีเซ็ตฟอร์ม
      setFormData({ name: '', price: 0, isAvailable: true, image: '' });
      
    } catch (error) {
      console.error('Error adding menu:', error);
      alert('❌ เกิดข้อผิดพลาด: รหัสไม่ถูกต้องหรือเซิร์ฟเวอร์มีปัญหา');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-container">
      {/* ส่วนหัว Header */}
      <div className="admin-header">
        <h1>👨‍🍳 จัดการเมนูอาหาร</h1>
        <button onClick={logout} className="logout-btn">
          ออกจากระบบ
        </button>
      </div>

      <div className="admin-card">
        <h3 style={{ marginTop: 0, color: '#555' }}>เพิ่มรายการใหม่</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>ชื่อเมนูอาหาร:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="เช่น ข้าวกะเพราหมูสับ"
              required
            />
          </div>

          <div className="form-group">
            <label>ราคา (บาท):</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label>ลิงก์รูปภาพ (URL):</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="http://example.com/food.jpg"
            />
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleChange}
              />
              <span>เปิดขายทันที</span>
            </label>
          </div>

          <button type="submit" disabled={isLoading} className="submit-btn">
            {isLoading ? '⏳ กำลังบันทึก...' : '💾 บันทึกเมนู'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminScreen;