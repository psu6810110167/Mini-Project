import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import MenuScreen from './MenuScreen';
import AdminScreen from './AdminScreen';
import LoginScreen from './LoginScreen';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

// 1. สร้างตัวป้องกัน (Guard)
// [แก้ไข] เปลี่ยนจาก JSX.Element เป็น React.ReactNode เพื่อแก้ Error เส้นแดง
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin } = useAuth();
  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }
  // ใส่ Fragment (<>...</>) ครอบไว้เพื่อความชัวร์ในการ Return
  return <>{children}</>;
};

// 2. แยกส่วน Navbar ออกมาเป็น Component
const NavBar = () => {
  const location = useLocation(); // เช็คว่าตอนนี้อยู่ URL ไหน
  const { isAdmin, logout } = useAuth(); // ดึงสถานะ Admin มาเช็คเพื่อโชว์ปุ่ม

  return (
    <nav style={styles.navBar}>
      <div style={styles.navTitle}>🍔 My Restaurant</div>
      
      <div style={styles.navButtons}>
        {/* ปุ่มเมนูอาหาร (ไปที่ /) */}
        <Link to="/">
          <button style={location.pathname === '/' ? styles.activeBtn : styles.btn}>
            รายการอาหาร
          </button>
        </Link>
        
        {/* ปุ่ม Admin (ไปที่ /admin) */}
        <Link to="/admin">
          <button style={location.pathname === '/admin' ? styles.activeBtn : styles.btn}>
            จัดการหลังร้าน (Admin)
          </button>
        </Link>

        {/* ปุ่ม Logout (แสดงเฉพาะตอน Login แล้ว) */}
        {isAdmin && (
          <button onClick={logout} style={{ ...styles.btn, borderColor: 'red', color: 'red', marginLeft: '10px' }}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

// 3. Main App Component
const App: React.FC = () => {
  return (
    <AuthProvider> {/* ครอบด้วยระบบ Auth */}
      <Router> {/* ครอบด้วยระบบ Router */}
        <div className="app-container">
          
          <NavBar /> {/* เรียกใช้ Navbar ด้านบน */}

          <main style={styles.content}>
            <Routes>
              {/* Route หน้าแรก: เมนูอาหาร */}
              <Route path="/" element={<MenuScreen />} />
              
              {/* Route หน้า Login */}
              <Route path="/login" element={<LoginScreen />} />
              
              {/* Route หน้า Admin (ต้องผ่านด่าน ProtectedRoute ก่อน) */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <AdminScreen />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>

        </div>
      </Router>
    </AuthProvider>
  );
};

// สไตล์ (เหมือนเดิม)
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
    gap: '10px',
    alignItems: 'center'
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
    backgroundColor: '#ffa500',
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