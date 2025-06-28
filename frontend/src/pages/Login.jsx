import React, { useState } from 'react';
import { AppContext } from '../context/AppContext.jsx';
import axios from 'axios';

const Login = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    username: '', 
    password: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);


  const {isLoggedIn, setIsLoggedIn, role, setRole, user, setUser} = React.useContext(AppContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if(!formData.username || !formData.password) {
      setError('Username and password are required');
      return;
    }

    // Add your login logic here
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:3000/auth/login', formData, {
        withCredentials: true

      });

      if (response.data.status === 'success') {
        console.log('Login successful:', response.data);
        onLoginSuccess(response.data.data);
      }
    } catch (error) {
      console.error('Login error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      setError(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {

      })
      setError(null); // Clear any previous errors
      setIsLoggedIn(true);
      setLoading(false);
      console.log('User logged in:', response.data);
      setRole(response.data.data.role);
      console.log('User role:', response.data.data.role);
      setUser(response.data.data);
      // Handle successful login (e.g., redirect or update state)
    } catch (err) {
      console.error('Login failed:', err);
    }
    // const response = await axios.post('http://localhost:5000/api/login', formData)


    setError(null);

    
  };

  return (
    <>
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f0f8ff'
    }}>
      <form onSubmit={handleSubmit} className="login-container" style={{
        maxWidth: 400,
        width: '100%',
        margin: "20px",
        padding: "32px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 128, 128, 0.2)",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        gap: "20px"
      }}>
        <h2 style={{ 
          textAlign: "center", 
          color: "#008080",
          marginBottom: "8px",
          fontSize: "28px"
        }}>
          Welcome Back
        </h2>
        <p style={{
          textAlign: "center",
          color: "#666",
          marginBottom: "16px"
        }}>Please login to your account</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ 
            color: "#008080",
            fontWeight: "500",
            fontSize: "14px"
          }}>
            Username
          </label>
          <input
            value={formData.username}
            onChange={handleChange}
            type="text"
            name="username"
            placeholder="Enter your username"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "14px",
              transition: "border 0.3s",
              outline: "none"
            }}
            onFocus={(e) => e.target.style.borderColor = "#008080"}
            onBlur={(e) => e.target.style.borderColor = "#ccc"}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ 
            color: "#008080",
            fontWeight: "500",
            fontSize: "14px"
          }}>
            Password
          </label>
          <input
            value={formData.password}
            onChange={handleChange}
            type="password"
            name="password"
            placeholder="Enter your password"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "14px",
              transition: "border 0.3s",
              outline: "none"
            }}
            onFocus={(e) => e.target.style.borderColor = "#008080"}
            onBlur={(e) => e.target.style.borderColor = "#ccc"}
          />
        </div>

        {error && (
          <div style={{
            textAlign: "center",
            color: "#dc2626",
            fontSize: "14px",
            backgroundColor: "#fee2e2",
            padding: "8px",
            borderRadius: "4px"
          }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "12px",
            borderRadius: "6px",
            border: "none",
            background: loading ? "#ccc" : "#008080",
            color: "#fff",
            fontWeight: "600",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "16px",
            transition: "background 0.3s",
            marginTop: "8px"
          }}
          onMouseOver={(e) => !loading && (e.target.style.background = "#006666")}
          onMouseOut={(e) => !loading && (e.target.style.background = "#008080")}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
    </>
  );
};

export default Login;