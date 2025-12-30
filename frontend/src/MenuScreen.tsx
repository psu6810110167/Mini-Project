import React, { useState, useEffect } from 'react';
import axios from 'axios';
import type { Menu } from './types';

// เพิ่ม Type สำหรับสินค้าในตะกร้า (สืบทอดมาจาก Menu แต่เพิ่ม quantity)
interface CartItem extends Menu {
  quantity: number;
}

const MenuScreen: React.FC = () => {
  // --- State ---
  const [menus, setMenus] = useState<Menu[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]); // เก็บรายการที่เลือก
  const [loading, setLoading] = useState<boolean>(true);
  
  // --- Load Menus ---
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        // เช็ค URL ให้ตรงกับ Backend (มี /api หรือไม่)
        const response = await axios.get('http://localhost:3000/api/menus');
        if (Array.isArray(response.data)) {
          setMenus(response.data);
        }
      } catch (err) {
        console.error('Error fetching menus:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenus();
  }, []);

  // --- Logic ตะกร้าสินค้า ---
  
  // เพิ่มเมนูลงตะกร้า
  const addToCart = (menu: Menu) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === menu.id);
      if (existingItem) {
        // ถ้ามีอยู่แล้ว ให้เพิ่มจำนวน (+1)
        return prevCart.map((item) =>
          item.id === menu.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // ถ้ายังไม่มี ให้เพิ่มใหม่ (เริ่มที่ 1)
        return [...prevCart, { ...menu, quantity: 1 }];
      }
    });
  };

  // ลดจำนวน/ลบออกจากตะกร้า
  const removeFromCart = (menuId: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === menuId);
      if (existingItem && existingItem.quantity > 1) {
        // ถ้าจำนวนมากกว่า 1 ให้ลดลง (-1)
        return prevCart.map((item) =>
          item.id === menuId ? { ...item, quantity: item.quantity - 1 } : item
        );
      } else {
        // ถ้าเหลือ 1 ให้ลบทิ้งเลย
        return prevCart.filter((item) => item.id !== menuId);
      }
    });
  };

  // คำนวณราคารวม
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // --- สั่งอาหาร (ส่งไป Backend) ---
  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;

    try {
      // เตรียมข้อมูลที่จะส่งไป Backend
      const orderData = {
        customerName: "ลูกค้าทั่วไป (โต๊ะ 1)", // ในอนาคตอาจทำช่องกรอกชื่อ
        items: cart, // ส่ง Array ของในตะกร้าไปเลย (เพราะเราใช้ jsonb ใน DB)
        totalPrice: totalPrice,
      };

      // ยิง API ไปที่ Backend (Route ที่เราเพิ่งสร้าง)
      await axios.post('http://localhost:3000/api/orders', orderData);

      alert('✅ สั่งอาหารเรียบร้อยแล้ว! รอสักครู่นะครับ');
      setCart([]); // ล้างตะกร้า
    } catch (error) {
      console.error('Order failed:', error);
      alert('❌ สั่งอาหารไม่สำเร็จ กรุณาลองใหม่');
    }
  };

  // --- Render ---
  if (loading) return <div style={{ textAlign: 'center', marginTop: '20px' }}>⏳ กำลังโหลดเมนู...</div>;

  return (
    <div style={{ padding: '20px', paddingBottom: '100px' }}> {/* paddingBottom เผื่อที่ให้แถบตะกร้าด้านล่าง */}
      <h1 style={{ textAlign: 'center' }}>🍽️ เลือกเมนูความอร่อย</h1>

      {/* Grid แสดงเมนู */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {menus.map((menu) => {
          // เช็คว่าเมนูนี้มีอยู่ในตะกร้ากี่อันแล้ว
          const cartItem = cart.find((item) => item.id === menu.id);
          const qty = cartItem ? cartItem.quantity : 0;

          return (
            <div key={menu.id} style={{ border: '1px solid #ddd', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
              <div style={{ height: '180px', backgroundColor: '#eee' }}>
                <img 
                  src={menu.image || 'https://via.placeholder.com/250x180?text=No+Image'} 
                  alt={menu.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/250x180?text=No+Image'; }}
                />
              </div>
              
              <div style={{ padding: '15px' }}>
                <h3 style={{ margin: '0 0 5px' }}>{menu.name}</h3>
                <p style={{ color: '#28a745', fontWeight: 'bold', fontSize: '18px' }}>฿{menu.price}</p>
                
                {/* ปุ่มกดสั่ง */}
                {menu.isAvailable ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
                    {qty > 0 ? (
                      <>
                        <button 
                          onClick={() => removeFromCart(menu.id)}
                          style={{ background: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', width: '30px', height: '30px', cursor: 'pointer' }}
                        >-</button>
                        <span style={{ fontWeight: 'bold', fontSize: '18px' }}>{qty}</span>
                        <button 
                          onClick={() => addToCart(menu)}
                          style={{ background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', width: '30px', height: '30px', cursor: 'pointer' }}
                        >+</button>
                      </>
                    ) : (
                      <button 
                        onClick={() => addToCart(menu)}
                        style={{ width: '100%', background: '#007bff', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}
                      >
                        🛒 ใส่ตะกร้า
                      </button>
                    )}
                  </div>
                ) : (
                  <div style={{ color: 'red', textAlign: 'center', border: '1px solid red', padding: '5px', borderRadius: '5px' }}>หมด</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* แถบสรุปตะกร้าสินค้า (ลอยอยู่ด้านล่าง) */}
      {cart.length > 0 && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          backgroundColor: 'white', borderTop: '2px solid #28a745',
          padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
        }}>
          <div>
            <span style={{ fontWeight: 'bold', fontSize: '18px' }}>รายการในตะกร้า: {cart.reduce((a, b) => a + b.quantity, 0)} ชิ้น</span>
            <br />
            <span style={{ color: '#555' }}>รวมเป็นเงิน: <b style={{ color: '#28a745', fontSize: '20px' }}>฿{totalPrice}</b></span>
          </div>
          
          <button 
            onClick={handlePlaceOrder}
            style={{ 
              backgroundColor: '#28a745', color: 'white', 
              border: 'none', padding: '12px 30px', 
              borderRadius: '30px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(40, 167, 69, 0.3)'
            }}
          >
            ยืนยันการสั่งซื้อ 🚀
          </button>
        </div>
      )}
    </div>
  );
};

export default MenuScreen;


















