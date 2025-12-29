import React, { useState } from 'react';
import MenuScreen from './MenuScreen';
import AdminScreen from './AdminScreen';
import './App.css'; // ไฟล์ CSS หลัก (ถ้ามี)

// สร้าง Type สำหรับระบุว่าตอนนี้อยู่หน้าไหน
type Page = 'menu' | 'admin';

const App: React.FC = () => {
  // state สำหรับเก็บว่าปัจจุบันแสดงหน้าไหนอยู่ (ค่าเริ่มต้นคือ 'menu')
  const [currentPage, setCurrentPage] = useState<Page>('menu');

  return (
    <div className="app-container">
      {/* --- ส่วน Navigation Bar (เมนูนำทางด้านบน) --- */}
      <nav style={styles.navBar}>
        <div style={styles.navTitle}>🍔 My Restaurant</div>
        
        <div style={styles.navButtons}>
          <button 
            style={currentPage === 'menu' ? styles.activeBtn : styles.btn}
            onClick={() => setCurrentPage('menu')}
          >
            รายการอาหาร
          </button>
          
          <button 
            style={currentPage === 'admin' ? styles.activeBtn : styles.btn}
            onClick={() => setCurrentPage('admin')}
          >
            จัดการหลังร้าน (Admin)
          </button>
        </div>
      </nav>

      {/* --- ส่วนเนื้อหา (Content) --- */}
      <main style={styles.content}>
        {/* ใช้เงื่อนไขเลือกแสดงผล Component */}
        {currentPage === 'menu' ? (
          <MenuScreen />
        ) : (
          <AdminScreen />
        )}
      </main>
    </div>
  );
};

// สไตล์แบบง่ายๆ (เขียนใส่ในไฟล์นี้เลยเพื่อความสะดวก)
const styles = {
  navBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 30px',
    backgroundColor: '#333',
    color: 'white',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
  },
  navTitle: {
    fontSize: '24px',
    fontWeight: 'bold'
  },
  navButtons: {
    display: 'flex',
    gap: '10px'
  },
  btn: {
    padding: '8px 16px',
    backgroundColor: 'transparent',
    color: '#ddd',
    border: '1px solid #777',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px'
  },
  activeBtn: {
    padding: '8px 16px',
    backgroundColor: '#ffa500', // สีส้ม
    color: 'black',
    border: '1px solid #ffa500',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px'
  },
  content: {
    padding: '20px'
  }
};

export default App;