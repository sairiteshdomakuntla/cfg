import { useState, useEffect } from 'react'
import './App.css'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import EducatorDashboard from './pages/EducatorDashboard'
import axios from 'axios'


function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get('http://localhost:3000/auth/is-auth', {
        withCredentials: true
      });
      if (response.data.status === 'success') {
        setUser(response.data.data);
      }
    } catch (error) {
      console.log('User not authenticated');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:3000/auth/logout', {
        withCredentials: true
      });
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Login onLoginSuccess={setUser} />;
  }

  // Show appropriate dashboard based on user role
  if (user.role === 'Admin') {
    return (
      <div>
        <div style={{ 
          padding: '10px 20px', 
          backgroundColor: '#008080', 
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>Welcome, {user.username} (Admin)</span>
          <button 
            onClick={handleLogout}
            style={{
              padding: '8px 16px',
              backgroundColor: 'transparent',
              color: 'white',
              border: '1px solid white',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
        <AdminDashboard />
      </div>
    );
  }

  // Show educator dashboard
  if (user.role === 'Educator') {
    return (
      <div>
        <div style={{ 
          padding: '10px 20px', 
          backgroundColor: '#008080', 
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>Welcome, {user.username} (Educator)</span>
          <button 
            onClick={handleLogout}
            style={{
              padding: '8px 16px',
              backgroundColor: 'transparent',
              color: 'white',
              border: '1px solid white',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
        <EducatorDashboard />
      </div>
    );
  }

  // For now, show a placeholder for other roles (Student)
  return (
    <div>
      <div style={{ 
        padding: '10px 20px', 
        backgroundColor: '#008080', 
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span>Welcome, {user.username} ({user.role})</span>
        <button 
          onClick={handleLogout}
          style={{
            padding: '8px 16px',
            backgroundColor: 'transparent',
            color: 'white',
            border: '1px solid white',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
      <div style={{ padding: '20px' }}>
        <h2>{user.role} Dashboard</h2>
        <p>Dashboard for {user.role} role is coming soon...</p>
      </div>
    </div>
  );
}

export default App;
