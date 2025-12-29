import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MenuScreen.css';

// 1. สร้าง Interface เพื่อกำหนดรูปร่างของข้อมูลเมนูอาหาร
interface Menu {
  id: number;           // หรือ string ขึ้นอยู่กับ Database ของคุณ
  name: string;
  price: number;
  isAvailable: boolean;
  image?: string;       // ใส่ ? ไว้เผื่อบางเมนูไม่มีรูป (Optional)
}

const MenuScreen: React.FC = () => {
  // 2. กำหนด Type ให้กับ State (บอกว่าเป็น Array ของ Menu)
  const [menus, setMenus] = useState<Menu[]>([]);
  const [cartTotal, setCartTotal] = useState<number>(0);

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      // 3. ระบุ Generic Type ให้ axios เพื่อให้รู้ว่า data ที่กลับมาหน้าตาเป็นอย่างไร
      const response = await axios.get<Menu[]>('http://localhost:3000/api/menus');
      setMenus(response.data);
    } catch (error) {
      console.error('Error fetching menus:', error);
    }
  };

  // 4. ระบุ Type ของ Parameter ที่รับเข้ามา
  const handleOrder = (price: number) => {
    setCartTotal(cartTotal + Number(price));
    alert('เพิ่มลงตะกร้าแล้ว!');
  };

  return (
    <div className="container">
      <h1>🍽️ รายการอาหาร</h1>
      <div className="total-bar">
        ยอดรวมตะกร้า: <strong>{cartTotal} บาท</strong>
      </div>
      
      <div className="menu-grid">
        {menus.map((menu) => (
          <div key={menu.id} className="menu-card">
            {/* ถ้ามีรูป สามารถใช้: src={menu.image} */}
            <div className="menu-image-placeholder">🥘</div> 
            <h3>{menu.name}</h3>
            <p className="price">{menu.price} บาท</p>
            
            {menu.isAvailable ? (
              <button onClick={() => handleOrder(menu.price)}>
                สั่งอาหาร
              </button>
            ) : (
              <button disabled style={{backgroundColor: 'gray'}}>
                หมด
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MenuScreen;