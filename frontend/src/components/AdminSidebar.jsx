import React from 'react';
import { Home, Users, LogOut } from 'lucide-react';

const AdminSidebar = () => (
  <aside className="w-64 bg-teal-700 text-white h-screen p-6">
    <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
    <nav className="space-y-4">
      <a href="/admin/dashboard" className="flex items-center space-x-2 hover:text-teal-200">
        <Home size={20} />
        <span>Dashboard</span>
      </a>
      <a href="/admin/educators" className="flex items-center space-x-2 hover:text-teal-200">
        <Users size={20} />
        <span>Educators</span>
      </a>
      <a href="/logout" className="flex items-center space-x-2 hover:text-teal-200">
        <LogOut size={20} />
        <span>Logout</span>
      </a>
    </nav>
  </aside>
);

export default AdminSidebar;