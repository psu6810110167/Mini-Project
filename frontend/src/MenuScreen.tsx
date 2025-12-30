import React, { useState, useEffect } from 'react';
import axios from 'axios';

// 1. กำหนดหน้าตาข้อมูล
interface Menu {
  id: number;
  name: string;
  price: number;
  image: string;
  isAvailable: boolean;
}

interface CartItem extends Menu {
  quantity: number; // เพิ่มจำนวนชิ้นเข้ามา
}

const MenuScreen: React.FC = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]); // 🛒 สถานะตะกร้าสินค้า
  const [isCartOpen, setIsCartOpen] = useState(false); // สถานะเปิด/ปิดหน้าต่างตะกร้า

  // ดึงเมนูจาก Backend
  useEffect(() => {
    axios.get('http://localhost:3000/api/menus')
      .then(response => setMenus(response.data))
      .catch(err => console.error(err));
  }, []);

  // ➕ ฟังก์ชันเพิ่มลงตะกร้า
  const addToCart = (menu: Menu) => {
    setCart(prevCart => {
      // เช็คว่ามีเมนูนี้ในตะกร้าหรือยัง?
      const existingItem = prevCart.find(item => item.id === menu.id);
      
      if (existingItem) {
        // ถ้ามีแล้ว ให้บวกจำนวนเพิ่ม
        return prevCart.map(item => 
          item.id === menu.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // ถ้ายังไม่มี ให้เพิ่มรายการใหม่
        return [...prevCart, { ...menu, quantity: 1 }];
      }
    });
  };

  // ➖ ฟังก์ชันลดจำนวน/ลบออกจากตะกร้า
  const removeFromCart = (menuId: number) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === menuId) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      }).filter(item => item.quantity > 0); // ถ้าเหลือ 0 ให้ลบทิ้ง
    });
  };

  // 💰 คำนวณราคารวม
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // 🚀 ฟังก์ชันกดยืนยันออเดอร์
  const handleConfirmOrder = async () => {
    if (cart.length === 0) return;

    try {
      const orderData = {
        customerName: "ลูกค้าหน้าร้าน", // (อนาคตทำช่องกรอกชื่อได้)
        items: cart,     // ส่งของในตะกร้าไป
        totalPrice: totalPrice,
        status: "pending"
      };

      await axios.post('http://localhost:3000/api/orders', orderData);
      
      alert('✅ สั่งอาหารสำเร็จ! รอสักครู่นะครับ');
      setCart([]); // ล้างตะกร้า
      setIsCartOpen(false); // ปิดหน้าต่างตะกร้า

    } catch (error) {
      console.error(error);
      alert('❌ สั่งอาหารไม่สำเร็จ (ลองเช็ค Backend)');
    }
  };

  return (
    <div style={{ padding: '20px', paddingBottom: '100px', backgroundColor: '#f4f4f9', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>🍽️ เมนูอาหาร</h1>

      {/* รายการเมนู */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
        {menus.map((menu) => (
          <div key={menu.id} style={{ 
            width: '160px', backgroundColor: 'white', borderRadius: '10px', 
            overflow: 'hidden', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', cursor: 'pointer',
            border: !menu.isAvailable ? '2px solid #ccc' : 'none'
          }} onClick={() => menu.isAvailable && addToCart(menu)}>
            
            <img src={menu.image || 'https://via.placeholder.com/150'} alt={menu.name} style={{ width: '100%', height: '120px', objectFit: 'cover', filter: !menu.isAvailable ? 'grayscale(100%)' : 'none' }} />
            
            <div style={{ padding: '10px' }}>
              <h4 style={{ margin: '0 0 5px 0', fontSize: '1rem' }}>{menu.name}</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#28a745', fontWeight: 'bold' }}>฿{menu.price}</span>
                {!menu.isAvailable && <span style={{ fontSize: '0.8rem', color: 'red' }}>หมด</span>}
              </div>
            </div>
            
            {/* แสดงจำนวนที่เลือกไว้บนการ์ดเมนู */}
            {cart.find(c => c.id === menu.id) && (
              <div style={{ backgroundColor: '#ffc107', textAlign: 'center', fontSize: '0.8rem', padding: '2px' }}>
                เลือกแล้ว {cart.find(c => c.id === menu.id)?.quantity} ชิ้น
              </div>
            )}
          </div>
        ))}
      </div>

      {/* --- 🛒 ส่วนของตะกร้าสินค้า (Floating Bar) --- */}
      {cart.length > 0 && (
        <>
          {/* ปุ่มลอยด้านล่าง */}
          <div style={{ 
            position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
            width: '90%', maxWidth: '500px', backgroundColor: '#333', color: 'white',
            borderRadius: '50px', padding: '15px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            boxShadow: '0 5px 15px rgba(0,0,0,0.3)', cursor: 'pointer', zIndex: 1000
          }} onClick={() => setIsCartOpen(true)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ backgroundColor: '#ffc107', color: 'black', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>
                {totalItems}
              </div>
              <span>ดูตะกร้าสินค้า</span>
            </div>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>฿{totalPrice}</span>
          </div>

          {/* หน้าต่างสรุปรายการ (Popup/Modal) */}
          {isCartOpen && (
            <div style={{ 
              position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
              backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'flex-end' 
            }}>
              <div style={{ 
                backgroundColor: 'white', width: '100%', maxWidth: '500px', 
                borderTopLeftRadius: '20px', borderTopRightRadius: '20px', padding: '20px',
                maxHeight: '80vh', overflowY: 'auto', animation: 'slideUp 0.3s ease-out'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <h2>🛒 สรุปรายการ</h2>
                  <button onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>❌</button>
                </div>

                {cart.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', padding: '10px 0' }}>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                      <div style={{ color: '#666', fontSize: '0.9rem' }}>฿{item.price} x {item.quantity}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button onClick={() => removeFromCart(item.id)} style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #ddd', background: 'white', cursor: 'pointer' }}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => addToCart(item)} style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #28a745', background: '#28a745', color: 'white', cursor: 'pointer' }}>+</button>
                    </div>
                  </div>
                ))}

                <div style={{ marginTop: '20px', fontSize: '1.2rem', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                  <span>ราคารวมทั้งสิ้น</span>
                  <span style={{ color: '#28a745' }}>฿{totalPrice}</span>
                </div>

                <button 
                  onClick={handleConfirmOrder}
                  style={{ 
                    width: '100%', marginTop: '20px', padding: '15px', 
                    backgroundColor: '#28a745', color: 'white', border: 'none', 
                    borderRadius: '10px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' 
                  }}
                >
                  🚀 ยืนยันการสั่งซื้อ
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MenuScreen;