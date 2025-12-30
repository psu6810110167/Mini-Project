import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import MenuScreen from './MenuScreen';
import AdminScreen from './AdminScreen';
import LoginScreen from './LoginScreen';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

// 1. Guard (ป้องกันหน้า Admin)
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin } = useAuth();
  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// 2. NavBar (แก้ใหม่: ใช้การสลับปุ่มตามสถานะ isAdmin)
const NavBar = () => {
  const location = useLocation();
  const { isAdmin, logout } = useAuth();

  return (
    <nav style={styles.navBar}>
      <div style={styles.navTitle}>🍔 My Restaurant</div>
      
      <div style={styles.navButtons}>
        {/* ปุ่มเมนูอาหาร (แสดงตลอด) */}
        <Link to="/">
          <button style={location.pathname === '/' ? styles.activeBtn : styles.btn}>
            รายการอาหาร
          </button>
        </Link>
        
        {/* --- [จุดที่แก้ไข] --- */}
        {/* เช็คว่า: เป็น Admin หรือยัง? */}
        {isAdmin ? (
          // ถ้าเป็น Admin: ให้โชว์ปุ่ม "ไปหลังร้าน" และ "Logout"
          <>
            <Link to="/admin">
              <button style={location.pathname === '/admin' ? styles.activeBtn : styles.btn}>
                จัดการหลังร้าน (Admin)
              </button>
            </Link>
            
            <button 
              onClick={logout} 
              style={{ ...styles.btn, borderColor: '#ff4d4d', color: '#ff4d4d', marginLeft: '10px' }}
            >
              Logout
            </button>
          </>
        ) : (
          // ถ้ายังไม่ Login: ให้โชว์ปุ่ม "Login"
          <Link to="/login">
            <button style={location.pathname === '/login' ? styles.activeBtn : styles.btn}>
              Login
            </button>
          </Link>
        )}
        {/* ------------------ */}
        
      </div>
    </nav>
  );
};

// 3. Main App (เหมือนเดิม)
const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <NavBar />
          <main style={styles.content}>
            <Routes>
              <Route path="/" element={<MenuScreen />} />
              <Route path="/login" element={<LoginScreen />} />
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

// Styles (เหมือนเดิม)
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