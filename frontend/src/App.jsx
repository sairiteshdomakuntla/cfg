import { useState, useEffect } from 'react'
import './App.css'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import EducatorDashboard from './pages/EducatorDashboard'
import axios from 'axios'
import UserDashboard from './pages/UserDashboard'
import QuiztoPdf from "./components/QuizToPDF";



function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get('https://vision-global.onrender.com/auth/is-auth', {
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
      await axios.get('https://vision-global.onrender.com/auth/logout', {
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
          <span className='font-bold'>Vision Global Empowerment</span>
          <div className='flex gap-2'>

            <button
              onClick={() => setShowQuiz(true)}
              style={{
                padding: "8px 16px",
                backgroundColor: "white",
                color: "#008080",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Quiz → PDF
            </button>
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

        </div>
        {showQuiz ? (
          <div style={{ padding: "20px" }}>
            <QuiztoPdf />
            <button
              onClick={() => setShowQuiz(false)}
              style={{
                marginTop: "10px",
                padding: "6px 12px",
                backgroundColor: "#e11d48",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        ) : (

          <AdminDashboard username={user.username} />
        )}

        {/* Welcome, {user.username} (Admin) */}
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
          <div className='flex gap-2'>

            <button
              onClick={() => setShowQuiz(true)}
              style={{
                padding: "8px 16px",
                backgroundColor: "white",
                color: "#008080",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Quiz → PDF
            </button>
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
        </div>
        {showQuiz ? (
          <div style={{ padding: "20px" }}>
            <QuiztoPdf />
            <button
              onClick={() => setShowQuiz(false)}
              style={{
                marginTop: "10px",
                padding: "6px 12px",
                backgroundColor: "#e11d48",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        ) : (


          <EducatorDashboard />
        )}
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
      <UserDashboard />
    </div>
  );
}

export default App;