import React, { useState } from 'react';
import axios from 'axios';
import { type CreateMenuDto } from './types';
import './AdminScreen.css'; // เดี๋ยวสร้างไฟล์ CSS นี้ในขั้นตอนต่อไป

const AdminScreen: React.FC = () => {
  // 1. State สำหรับเก็บข้อมูลในฟอร์ม (ค่าเริ่มต้น)
  const [formData, setFormData] = useState<CreateMenuDto>({
    name: '',
    price: 0,
    isAvailable: true,
    image: ''
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 2. ฟังก์ชันจัดการการพิมพ์ข้อมูล (Handle Input Change)
  // React.ChangeEvent<HTMLInputElement> คือ Type ของ Event เวลาพิมพ์ในช่อง input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'price' ? Number(value) : value)
    }));
  };

  // 3. ฟังก์ชันกดปุ่มบันทึก (Submit Form)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // ป้องกันหน้าเว็บ Refresh
    
    if (!formData.name || formData.price <= 0) {
      alert('กรุณากรอกชื่อและราคาให้ถูกต้อง');
      return;
    }

    try {
      setIsLoading(true);
      // ยิง API ไปที่ Backend (Method POST)
      await axios.post('http://localhost:3000/api/menus', formData);
      
      alert('✅ เพิ่มเมนูสำเร็จ!');
      // เคลียร์ค่าในฟอร์ม
      setFormData({ name: '', price: 0, isAvailable: true, image: '' });
      
    } catch (error) {
      console.error('Error adding menu:', error);
      alert('❌ เกิดข้อผิดพลาด ไม่สามารถเพิ่มเมนูได้');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <h1>👨‍🍳 เพิ่มเมนูอาหารใหม่</h1>
      
      <form onSubmit={handleSubmit} className="admin-form">
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