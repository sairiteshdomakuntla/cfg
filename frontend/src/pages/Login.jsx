import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '', 
    password: '', 
    role: 'Student'
  });
  const [error, setError] = useState(null);

  const {isLoggedIn, setIsLoggedIn, role, setRole, user, setUser} = React.useContext(AppContext);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    if(!formData.username || !formData.password) {
      setError('Username and password are required');
      return;
    }
    // Add your login logic here
    try {
      const response = await axios.post('http://localhost:5000/api/login', formData, {
        withCredentials: true
      });
      console.log('Login successful:', response.data);
      setError(null); // Clear any previous errors
      setIsLoggedIn(true);
      console.log('User logged in:', response.data.user);
      setRole(response.data.role);
      setUser(response.data.user);
      // Handle successful login (e.g., redirect or update state)
    } catch (err) {
      console.error('Login failed:', err);
    }
    // const response = await axios.post('http://localhost:5000/api/login', formData)

  };

  return (
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ 
            color: "#008080",
            fontWeight: "500",
            fontSize: "14px"
          }}>
            Role
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "14px",
              color: "#333",
              backgroundColor: "#fff",
              cursor: "pointer",
              transition: "border 0.3s",
              outline: "none",
              appearance: "none",
              backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23008080' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 10px center",
              backgroundSize: "16px"
            }}
            onFocus={(e) => e.target.style.borderColor = "#008080"}
            onBlur={(e) => e.target.style.borderColor = "#ccc"}
          >
            <option value="Student">Student</option>
            <option value="Educator">Educator</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        <div className="text-center text-red-500">{error}</div>
        <button
          type="submit"
          style={{
            padding: "12px",
            borderRadius: "6px",
            border: "none",
            background: "#008080",
            color: "#fff",
            fontWeight: "600",
            cursor: "pointer",
            fontSize: "16px",
            transition: "background 0.3s",
            marginTop: "8px"
          }}
          onMouseOver={(e) => e.target.style.background = "#006666"}
          onMouseOut={(e) => e.target.style.background = "#008080"}
        >
          Login
        </button>
        
      </form>
      
    </div>
  );
};

export default Login;