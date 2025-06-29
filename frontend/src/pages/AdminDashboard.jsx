import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../components/AdminSidebar';

const AdminDashboard = ({username}) => {
  const [educators, setEducators] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchEducators();
  }, []);

  const fetchEducators = async () => {
    try {
      const response = await axios.get('https://vision-global.onrender.com/admin/educators', {
        withCredentials: true
      });
      if (response.data.status === 'success') {
        setEducators(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching educators:', error);
      setError('Failed to fetch educators');
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateEducator = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post('https://vision-global.onrender.com/admin/create-educator', formData, {
        withCredentials: true
      });

      if (response.data.status === 'success') {
        setSuccess('Educator created successfully!');
        setFormData({ name: '', username: '', password: '' });
        setShowCreateForm(false);
        fetchEducators();
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create educator');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 bg-gray-50">
        <h1 className="text-3xl font-bold mb-4 text-teal-700">Welcome {username}</h1>
        <p className="text-gray-600 mb-8">Admin Dashboard - Manage Educators & Centers</p>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-r from-teal-500 to-teal-700 p-4 rounded text-white">
            <h2 className="text-xl font-bold">20</h2>
            <p>Centers</p>
          </div>
          <div className="bg-gradient-to-r from-cyan-400 to-cyan-600 p-4 rounded text-white">
            <h2 className="text-xl font-bold">{educators.length}</h2>
            <p>Educators</p>
          </div>
          <div className="bg-gradient-to-r from-teal-500 to-teal-700 p-4 rounded text-white">
            <h2 className="text-xl font-bold">259</h2>
            <p>Students</p>
          </div>
          <div className="bg-gradient-to-r from-cyan-400 to-cyan-600 p-4 rounded text-white">
            <h2 className="text-xl font-bold">79%</h2>
            <p>Avg Progress</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-700 p-4 rounded mb-4">
            {success}
          </div>
        )}

        {/* Add Educator Button */}
        <div className="mb-4">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-teal-700 text-white px-4 py-2 rounded"
          >
            {showCreateForm ? 'Cancel' : 'Add New Educator'}
          </button>
        </div>

        {/* Create Educator Form */}
        {showCreateForm && (
          <div className="bg-white p-6 rounded shadow mb-8">
            <h3 className="text-xl font-semibold mb-4 text-teal-700">Create New Educator</h3>
            <form onSubmit={handleCreateEducator} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Username:</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Password:</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`bg-teal-700 text-white px-4 py-2 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Creating...' : 'Create Educator'}
              </button>
            </form>
          </div>
        )}

        {/* Educators Table */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-teal-700">All Educators</h3>
          {educators.length === 0 ? (
            <p>No educators found.</p>
          ) : (
            <div className="overflow-x-auto bg-white rounded shadow">
              <table className="min-w-full border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left border-b">Name</th>
                    <th className="p-3 text-left border-b">Username</th>
                    <th className="p-3 text-left border-b">Role</th>
                    <th className="p-3 text-left border-b">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {educators.map((educator) => (
                    <tr key={educator._id} className="border-b">
                      <td className="p-3">{educator.name}</td>
                      <td className="p-3">{educator.username}</td>
                      <td className="p-3">{educator.role}</td>
                      <td className="p-3">
                        {new Date(educator.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
