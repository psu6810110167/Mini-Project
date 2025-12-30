import React, { createContext, useState, useContext, useEffect } from 'react';

// 1. กำหนดหน้าตาของ User Profile
// เพื่อบอกว่าคนนี้ชื่ออะไร และเป็น role ไหน
interface UserProfile {
  username: string;
  role: 'admin' | 'user'; 
}

// 2. กำหนดหน้าตาของ Context ที่จะส่งให้คนอื่นใช้
interface AuthContextType {
  user: UserProfile | null;            // เก็บข้อมูลคน Login (ถ้า null แปลว่ายังไม่ Login)
  isAdmin: boolean;                    // ตัวช่วยเช็คง่ายๆ ว่าใช่ Admin ไหม
  adminSecret: string | null;          // รหัสลับ (เอาไว้ยิง API ถ้าเป็น Admin)
  login: (username: string, secret: string) => boolean; // รับ username เพิ่มมาด้วย
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // --- STATE ---
  // ดึงข้อมูล User จาก LocalStorage (ถ้ามี)
  const [user, setUser] = useState<UserProfile | null>(() => {
    const savedUser = localStorage.getItem('user_profile');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // ดึงรหัสลับ Admin จาก LocalStorage (ถ้ามี)
  const [adminSecret, setAdminSecret] = useState<string | null>(
    localStorage.getItem('adminSecret')
  );

  // เช็คสถานะว่าเป็น Admin ไหม (Derived State)
  const isAdmin = user?.role === 'admin';

  // --- ACTIONS ---
  
  // ฟังก์ชัน Login: รับทั้ง Username และ Password
  const login = (username: string, secret: string) => {
    
    // กรณีที่ 1: กรอกรหัสลับถูกต้อง -> เป็น Admin
    // (ในโค้ดเก่าคุณใช้คำว่า 'admin' เป็นรหัส แต่ถ้าคุณแก้เป็นอย่างอื่นใน Backend ให้แก้ตรงนี้ด้วย)
    if (secret === 'admin') { 
      const adminProfile: UserProfile = { username, role: 'admin' };
      
      // Update State
      setUser(adminProfile);
      setAdminSecret(secret);

      // Save to LocalStorage
      localStorage.setItem('user_profile', JSON.stringify(adminProfile));
      localStorage.setItem('adminSecret', secret);
      return true;
    } 
    
    // กรณีที่ 2: กรอก User ธรรมดา (รหัสอะไรก็ได้ หรือไม่ใส่รหัสก็ได้ แต่ต้องมีชื่อ)
    // ตรงนี้เราสมมติว่าถ้าไม่ใส่รหัส Admin ให้ถือเป็น User ทั่วไป
    else if (username.trim() !== '') {
      const userProfile: UserProfile = { username, role: 'user' };

      // Update State
      setUser(userProfile);
      setAdminSecret(null); // User ไม่มีสิทธิ์ถือรหัสลับ

      // Save to LocalStorage
      localStorage.setItem('user_profile', JSON.stringify(userProfile));
      localStorage.removeItem('adminSecret'); // ลบของเก่าทิ้งถ้ามี
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    setAdminSecret(null);
    localStorage.removeItem('user_profile');
    localStorage.removeItem('adminSecret');
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, adminSecret, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};