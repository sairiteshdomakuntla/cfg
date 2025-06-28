import React from 'react'

const Admin = () => {
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
  )
}

export default Admin
