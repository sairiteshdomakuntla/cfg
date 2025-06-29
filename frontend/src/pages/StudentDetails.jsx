import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Student from './Student'; // Assuming you have a Student component for editing
import StudentCharts from '../components/StudentCharts';

const StudentDetails = ({ studentId, onBack }) => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isChange, setIsChange] = useState(false);

  const handleSwitch = () => {
    setIsChange(!isChange);
  }
  useEffect(() => {
    fetchStudentDetails();
  }, [studentId]);

  const fetchStudentDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://vision-global.onrender.com/educator/students/${studentId}`, {
        withCredentials: true
      });

      if (response.data.status === 'success') {
        setStudent(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching student details:', error);
      setError('Failed to fetch student details');
    } finally {
      setLoading(false);
    }
  };
  if (isChange) {
    return <Student studentId={studentId} username={student.username} />
  }
  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Loading student details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <div style={{
          backgroundColor: '#fee2e2',
          color: '#dc2626',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
        <button
          onClick={onBack}
          style={{
            backgroundColor: '#008080',
            color: 'white',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Back to Students List
        </button>
        <button
          style={{
            backgroundColor: '#008080',
            color: 'white',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Add Details
        </button>
      </div>
    );
  }

  if (!student) {
    return (
      <div style={{ padding: '20px' }}>
        <p>No student data found</p>
        <button
          onClick={onBack}
          style={{
            backgroundColor: '#008080',
            color: 'white',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          Back to Students List
        </button>
        <button
          style={{
            backgroundColor: '#008080',
            color: 'white',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Add Details
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ color: '#008080' }}>Student Details</h2>
        <div className='flex gap-2'>
          <button
            onClick={onBack}
            style={{
              backgroundColor: '#008080',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Back to Students List
          </button>
          <button
            onClick={handleSwitch}
            style={{
              backgroundColor: '#008080',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Add Details
          </button>
        </div>
      </div>
      
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          marginBottom: '24px',
          borderBottom: '1px solid #e5e7eb',
          paddingBottom: '16px'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: '#008080',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            fontWeight: 'bold',
            marginRight: '16px'
          }}>
            {student.name.charAt(0)}
          </div>
          <div>
            <h3 style={{ fontSize: '24px', margin: '0 0 4px 0' }}>{student.name}</h3>
            <p style={{ margin: '0', color: '#666' }}>Student ID: {student.studentId}</p>
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          <div>
            <p style={{ color: '#666', margin: '0 0 4px 0' }}>Username</p>
            <p style={{ fontWeight: '500', margin: '0' }}>{student.username}</p>
          </div>
          <div>
            <p style={{ color: '#666', margin: '0 0 4px 0' }}>Email</p>
            <p style={{ fontWeight: '500', margin: '0' }}>{student.email}</p>
          </div>
          <div>
            <p style={{ color: '#666', margin: '0 0 4px 0' }}>Age</p>
            <p style={{ fontWeight: '500', margin: '0' }}>{student.age}</p>
          </div>
          <div>
            <p style={{ color: '#666', margin: '0 0 4px 0' }}>Class</p>
            <p style={{ fontWeight: '500', margin: '0' }}>{student.class}</p>
          </div>
          <div>
            <p style={{ color: '#666', margin: '0 0 4px 0' }}>Enrolled On</p>
            <p style={{ fontWeight: '500', margin: '0' }}>
              {new Date(student.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p style={{ color: '#666', margin: '0 0 4px 0' }}>Role</p>
            <p style={{ fontWeight: '500', margin: '0' }}>{student.role}</p>
          </div>
        </div>
        
        {/* You can add more sections here for grades, assignments, etc. */}
        <div style={{ marginTop: '24px', borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
          <h4 style={{ color: '#008080', marginBottom: '16px' }}>Academic Performance</h4>
          <p>Academic data coming soon...</p>
        </div>
      </div>
      <StudentCharts studentId={studentId} />
    </div>
  );
};

export default StudentDetails;