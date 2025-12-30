import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const LoginScreen: React.FC = () => {
  // เพิ่ม State สำหรับเก็บชื่อ User
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // ส่งทั้ง Username และ Password ไปให้ Context ตรวจสอบ
    const isSuccess = login(username, password);
    
    if (isSuccess) {
      // เช็คเงื่อนไขเพื่อพาไปหน้าให้ถูกคน
      if (password === 'admin') {
        alert('😎 ยินดีต้อนรับ Admin!');
        navigate('/admin'); // Admin ไปหลังร้าน
      } else {
        alert(`👋 ยินดีต้อนรับคุณ ${username}`);
        navigate('/'); // User ทั่วไป ไปหน้าเมนู
      }
    } else {
      alert('❌ กรุณากรอกชื่อผู้ใช้งาน (Username)');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '80px auto', padding: '30px', border: '1px solid #ddd', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>🔐 เข้าสู่ระบบ</h2>
      
      <form onSubmit={handleSubmit}>
        
        {/* --- [1] ช่องกรอกชื่อ User (เพิ่มใหม่) --- */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>ชื่อผู้ใช้งาน:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px' }}
            placeholder="กรอกชื่อของคุณ..."
            required
          />
        </div>

        {/* --- [2] ช่องกรอกรหัสผ่าน --- */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>รหัสผ่าน:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px' }}
            placeholder="User ทั่วไปไม่ต้องใส่ (Admin ใส่ 'admin')"
          />
          <small style={{ display: 'block', marginTop: '5px', color: '#777', fontSize: '12px' }}>
            * ลูกค้าทั่วไปไม่ต้องใส่รหัสผ่าน, สำหรับ Admin ใส่รหัส: <b>admin</b>
          </small>
        </div>

        <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', cursor: 'pointer', transition: 'background 0.3s' }}>
          เข้าสู่ระบบ
        </button>
      </form>
    </div>
  );
};

export default LoginScreen;