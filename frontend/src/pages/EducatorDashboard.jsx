import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EducatorDashboard = () => {
  const [students, setStudents] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    age: '',
    class: '',
    studentId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:3000/educator/students', {
        withCredentials: true
      });
      if (response.data.status === 'success') {
        setStudents(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setError('Failed to fetch students');
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post('http://localhost:3000/educator/create-student', formData, {
        withCredentials: true
      });

      if (response.data.status === 'success') {
        setSuccess('Student enrolled successfully!');
        setFormData({ 
          name: '', 
          username: '', 
          email: '', 
          password: '', 
          age: '', 
          class: '', 
          studentId: '' 
        });
        setShowCreateForm(false);
        fetchStudents(); // Refresh the list
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to enroll student');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#008080', marginBottom: '30px' }}>Educator Dashboard</h1>
      
      {error && (
        <div style={{
          backgroundColor: '#fee2e2',
          color: '#dc2626',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{
          backgroundColor: '#dcfce7',
          color: '#16a34a',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '20px'
        }}>
          {success}
        </div>
      )}

      <div style={{ marginBottom: '30px' }}>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          style={{
            backgroundColor: '#008080',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          {showCreateForm ? 'Cancel' : 'Enroll New Student'}
        </button>
      </div>

      {showCreateForm && (
        <div style={{
          backgroundColor: '#f9fafb',
          padding: '24px',
          borderRadius: '8px',
          marginBottom: '30px',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ marginBottom: '20px', color: '#008080' }}>Enroll New Student</h3>
          <form onSubmit={handleCreateStudent}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: '16px',
              marginBottom: '20px'
            }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                  Name:
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                  Username:
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                  Email:
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                  Password:
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                  Student ID:
                </label>
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                  Age:
                </label>
                <input
                  type="number"
                  name="age"
                  min="1"
                  value={formData.age}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                  Class:
                </label>
                <input
                  type="text"
                  name="class"
                  value={formData.class}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: loading ? '#ccc' : '#008080',
                color: 'white',
                padding: '12px 24px',
                border: 'none',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '16px'
              }}
            >
              {loading ? 'Enrolling...' : 'Enroll Student'}
            </button>
          </form>
        </div>
      )}

      <div>
        <h3 style={{ marginBottom: '20px', color: '#008080' }}>All Students</h3>
        {students.length === 0 ? (
          <p>No students found.</p>
        ) : (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f3f4f6' }}>
                <tr>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Name</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Student ID</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Username</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Email</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Age</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Class</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Created At</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>{student.name}</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>{student.studentId}</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>{student.username}</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>{student.email}</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>{student.age}</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>{student.class}</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>
                      {new Date(student.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EducatorDashboard;