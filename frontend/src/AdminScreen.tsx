import React, { useState } from 'react';
import axios from 'axios';
import { type CreateMenuDto } from './types';
import './AdminScreen.css';

const AdminScreen: React.FC = () => {
  // 1. State สำหรับเก็บข้อมูลในฟอร์ม (ค่าเริ่มต้น)
  const [formData, setFormData] = useState<CreateMenuDto>({
    name: '',
    price: 0,
    isAvailable: true,
    image: ''
  });
  
  const [adminSecret, setAdminSecret] = useState(''); 
  const [isLoading, setIsLoading] = useState(false);

  // 2. ฟังก์ชันจัดการการพิมพ์ข้อมูล (Handle Input Change)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? checked 
        : name === 'price' 
          ? parseFloat(value) || 0  // แปลงราคาเป็นตัวเลขเสมอ
          : value
    }));
  }; 
  // *** ลบ }; ที่เกินมาตรงนี้ออกเรียบร้อยแล้ว ***

  // 3. ฟังก์ชันกดปุ่มบันทึก (Submit Form)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // ป้องกันหน้าเว็บ Refresh
    
    // ตรวจสอบข้อมูลเบื้องต้น
    if (!formData.name || formData.price < 0) {
      alert('กรุณากรอกชื่อและราคาให้ถูกต้อง');
      return;
    }

    try {
      setIsLoading(true);
      // ยิง API ไปที่ Backend
      await axios.post('http://localhost:3000/api/menus', formData, {
        headers: {
          'admin-secret': adminSecret // ส่งรหัสลับไปให้ Backend ตรวจ
        }
      });
      
      alert('✅ เพิ่มเมนูสำเร็จ!');
      // เคลียร์ค่าในฟอร์ม
      setFormData({ name: '', price: 0, isAvailable: true, image: '' });
      
    } catch (error: any) {
      console.error('Error adding menu:', error);
      // เช็ค Error จาก Backend
      if (error.response && error.response.status === 401) {
         alert('❌ รหัส Admin ไม่ถูกต้อง!');
      } else {
         alert('❌ เกิดข้อผิดพลาด ไม่สามารถเพิ่มเมนูได้');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <h1>👨‍🍳 เพิ่มเมนูอาหารใหม่ (Admin Only)</h1>
      
      <form onSubmit={handleSubmit} className="admin-form">
        
        {/* --- ช่องกรอกรหัส Admin --- */}
        <div className="form-group" style={{ backgroundColor: '#fff3cd', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ffeeba' }}>
          <label style={{ color: '#856404', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
            🔑 รหัสลับ Admin (จำเป็น):
          </label>
          <input
            type="password"
            value={adminSecret}
            onChange={(e) => setAdminSecret(e.target.value)}
            placeholder="กรอกรหัสลับที่นี่..."
            required
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>

        <div className="form-group">
          <label>ชื่อเมนู:</label>
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
            min="0"
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
            เปิดขายทันที
          </label>
        </div>

        <button type="submit" disabled={isLoading} className="submit-btn">
          {isLoading ? 'กำลังบันทึก...' : 'บันทึกเมนู'}
        </button>
      </form>
    </div>
  );
};

export default AdminScreen;