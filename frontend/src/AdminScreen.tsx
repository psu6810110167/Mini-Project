import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import { useAuth } from './context/AuthContext'; 
import './AdminScreen.css'; 

// ใช้ตัวจำลอง Auth เหมือนเดิม
const useAuth = () => ({
  adminSecret: 'mySuperSecretPassword', 
  logout: () => window.location.href = '/'
});

interface Menu {
  id: number;
  name: string;
  price: number;
  isAvailable: boolean;
  image: string;
}

const AdminScreen: React.FC = () => {
  const { adminSecret, logout } = useAuth();
  
  const [menus, setMenus] = useState<Menu[]>([]); // เก็บรายการเมนูเพื่อแสดงผล
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    isAvailable: true,
    image: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // ฟังก์ชันดึงข้อมูลเมนู (เพิ่มมาใหม่ เพื่อให้หน้าจออัปเดต)
  const fetchMenus = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/menus');
      setMenus(response.data);
    } catch (error) {
      console.error('Error fetching menus:', error);
    }
  };

  // ดึงข้อมูลทันทีที่เปิดหน้า
  useEffect(() => {
    fetchMenus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'price' ? Number(value) : value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || formData.price <= 0) return alert('⚠️ ข้อมูลไม่ครบ');

    try {
      setIsLoading(true);
      await axios.post('http://localhost:3000/api/menus', formData, {
        headers: { 'admin-secret': adminSecret }
      });
      alert('✅ เพิ่มเมนูสำเร็จ!');
      setFormData({ name: '', price: 0, isAvailable: true, image: '' });
      fetchMenus(); // โหลดรายการใหม่ทันทีหลังเพิ่ม
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert('❌ เกิดข้อผิดพลาด');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 🔥 ฟังก์ชันลบเมนู (พระเอกของงานนี้)
  const handleDelete = async (id: number) => {
    // 1. ถามก่อนลบ กันมือลั่น
    if (!window.confirm('คุณแน่ใจไหมว่าจะลบเมนูนี้? ลบแล้วกู้คืนไม่ได้นะ!')) return;

    try {
      // 2. ส่งคำสั่งลบไป Backend
      await axios.delete(`http://localhost:3000/api/menus/${id}`, {
        headers: { 'admin-secret': adminSecret }
      });

      // 3. โหลดหน้าจอใหม่
      fetchMenus();
      
    } catch (error) {
      console.error('Error deleting:', error);
      alert('❌ ลบไม่สำเร็จ');
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>👨‍🍳 จัดการเมนูอาหาร</h1>
        <button onClick={logout} className="logout-btn">ออกจากระบบ</button>
      </div>

      <div className="admin-content-wrapper" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        
        {/* ฟอร์มเพิ่มข้อมูล (ด้านซ้าย) */}
        <div className="admin-card" style={{ flex: 1, minWidth: '300px' }}>
          <h3 style={{ marginTop: 0, color: '#555' }}>เพิ่มรายการใหม่</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>ชื่อเมนูอาหาร:</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>ราคา (บาท):</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} min="1" required />
            </div>
            <div className="form-group">
              <label>ลิงก์รูปภาพ (URL):</label>
              <input type="text" name="image" value={formData.image} onChange={handleChange} />
            </div>
            <div className="form-group checkbox-group">
              <label>
                <input type="checkbox" name="isAvailable" checked={formData.isAvailable} onChange={handleChange} />
                <span>เปิดขายทันที</span>
              </label>
            </div>
            <button type="submit" disabled={isLoading} className="submit-btn">
              {isLoading ? '⏳...' : '💾 บันทึกเมนู'}
            </button>
          </form>
        </div>

        {/* รายการเมนูที่มีอยู่ (ด้านขวา - เพิ่มใหม่) */}
        <div className="admin-list" style={{ flex: 2, minWidth: '300px' }}>
          <h3>📋 รายการอาหารทั้งหมด ({menus.length})</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
            {menus.map(menu => (
              <div key={menu.id} className="menu-item-card">
                <img src={menu.image || 'https://via.placeholder.com/150'} alt={menu.name} />
                <div className="menu-info">
                  <h4>{menu.name}</h4>
                  <p>฿{menu.price}</p>
                  
                  {/* ปุ่มลบสีแดง */}
                  <button 
                    onClick={() => handleDelete(menu.id)} 
                    className="delete-btn"
                  >
                    🗑️ ลบ
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminScreen;