import React, { useState } from 'react';
import axios from 'axios';
import { type CreateMenuDto } from './types';
import './AdminScreen.css';
import { useAuth } from './context/AuthContext'; // 1. เรียกใช้ระบบ Auth

const AdminScreen: React.FC = () => {
  // 2. ดึงรหัสลับมาจากระบบ Login (ไม่ต้องสร้าง State รับค่าเองแล้ว)
  const { adminSecret, logout } = useAuth(); 
  
  const [formData, setFormData] = useState<CreateMenuDto>({
    name: '',
    price: 0,
    isAvailable: true,
    image: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'price' ? Number(value) : value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || formData.price <= 0) {
      alert('กรุณากรอกชื่อและราคาให้ถูกต้อง');
      return;
    }

    try {
      setIsLoading(true);
      // 3. ส่ง adminSecret ที่ได้จาก Context ไปที่ Backend
      await axios.post('http://localhost:3000/api/menus', formData, {
        headers: {
          'admin-secret': adminSecret 
        }
      });
      
      alert('✅ เพิ่มเมนูสำเร็จ!');
      setFormData({ name: '', price: 0, isAvailable: true, image: '' });
      
    } catch (error) {
      console.error('Error adding menu:', error);
      alert('❌ เกิดข้อผิดพลาด หรือ Session หมดอายุ');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-container">
      {/* ส่วนหัว: มีปุ่ม Logout ให้ด้วย */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ margin: 0 }}>👨‍🍳 เพิ่มเมนูอาหารใหม่</h1>
        
        <button 
          onClick={logout} 
          style={{ 
            backgroundColor: '#dc3545', 
            color: 'white', 
            border: 'none', 
            padding: '8px 12px', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          ออกจากระบบ
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="admin-form">
        
        {/* --- [ลบ] ผมลบส่วนที่เป็นช่องกรอกรหัสสีเหลืองทิ้งไปแล้วครับ --- */}

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