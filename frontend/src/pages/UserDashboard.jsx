import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import StudentCharts from '../components/StudentCharts';

const UserDashboard = () => {
  const { user, isLoggedIn, getAuthStatus } = useContext(AppContext);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async (username) => {
      try {
        const response = await axios.get(`https://vision-global.onrender.com/user/get-data/${username}`, {
          withCredentials: true,
        });
        console.log(response.data);
        if (response.data.status === 'success') {
          setProfile(response.data.user);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError('Failed to load profile');
        console.error(err);
      }
    };

    if (user) {
      fetchProfile(user.username);
    }
  }, [user]);  // Added dependency array

  if (!isLoggedIn) {
    return <p className="p-4">Please log in to access your dashboard.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-teal-700">Welcome, {user?.username}</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>
      )}

      {profile ? (
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-xl font-semibold mb-2">Your Profile</h2>
          <p><strong>Student ID:</strong> {profile.studentId}</p>
          <p><strong>School:</strong> {profile.school}</p>
          <p><strong>Class:</strong> {profile.class}</p>
          <p><strong>Age:</strong> {profile.age}</p>
          <p><strong>Parent Phone:</strong> {profile.parent_phone}</p>
          <p><strong>Family Income:</strong> ₹{profile.family_income}</p>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}

      {/* Fixed the prop name from userId to studentId if that's what StudentCharts expects */}
      {profile && <StudentCharts studentId={profile.userId} />}
    </div>
  );
};

export default UserDashboard;