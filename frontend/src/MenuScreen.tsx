import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { type Menu } from './types';

const MenuScreen: React.FC = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchMenus = async () => {
    try {
      // *** ตรวจสอบ URL ให้ตรงกับที่คุณแก้ใน AdminScreen นะครับ ***
      // เช่น http://localhost:3000/menus หรือ http://localhost:3000/api/menus
      const response = await axios.get('http://localhost:3000/api/menus'); 
      
      console.log("Data from Backend:", response.data); // <--- ดูตรงนี้ใน Console (F12)

      // เช็คว่าเป็น Array จริงไหม? ถ้าใช่ให้เซ็ตค่า ถ้าไม่ใช่ให้เป็น Array ว่างๆ
      if (Array.isArray(response.data)) {
        setMenus(response.data);
      } else {
        console.warn("ข้อมูลที่ได้ไม่ใช่ Array!", response.data);
        setMenus([]); // กันเหนียวไว้ไม่ให้จอขาว
      }
    } catch (err) {
      console.error('Error fetching menus:', err);
      setError('ไม่สามารถดึงข้อมูลเมนูได้');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '20px' }}>⏳ กำลังโหลดรายการอาหาร...</div>;
  if (error) return <div style={{ textAlign: 'center', color: 'red', marginTop: '20px' }}>❌ {error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>🍽️ รายการอาหารของเรา</h1>
      
      {/* เกราะป้องกันชั้นที่ 2: เช็คก่อนวนลูปเสมอ */}
      {!menus || !Array.isArray(menus) || menus.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#777', marginTop: '50px' }}>
          ยังไม่มีรายการอาหารในขณะนี้
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
          gap: '20px' 
        }}>
          {menus.map((menu) => (
            <div key={menu.id} style={{ 
              border: '1px solid #ddd', 
              borderRadius: '8px', 
              overflow: 'hidden', 
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)' 
            }}>
              <div style={{ height: '200px', backgroundColor: '#f0f0f0' }}>
                {menu.image ? (
                  <img 
                    src={menu.image} 
                    alt={menu.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/250x200?text=No+Image'; }} 
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                    ไม่มีรูปภาพ
                  </div>
                )}
              </div>
              <div style={{ padding: '15px' }}>
                <h3 style={{ margin: '0 0 10px 0' }}>{menu.name}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#28a745' }}>฿{menu.price}</span>
                  {!menu.isAvailable && (
                    <span style={{ fontSize: '12px', color: 'red', border: '1px solid red', padding: '2px 6px', borderRadius: '4px' }}>
                      หมด
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuScreen;