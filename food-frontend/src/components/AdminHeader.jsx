import React from 'react';
import { Link } from 'react-router-dom';

const UserHeader = () => {
  return (
    <nav style={{ backgroundColor: '#4CAF50', padding: '1em 0' }}>
      <ul style={{ listStyle: 'none', textAlign: 'center', margin: 0, padding: 0 }}>
        <li style={{ display: 'inline-block', margin: '0 15px' }}>
          <Link to="/admin-dashboard" style={{ textDecoration: 'none', color: 'white', fontSize: '18px' }}>
          Admin Dashboard
          </Link>
        </li>
        <li style={{ display: 'inline-block', margin: '0 15px' }}>
          <Link to="/admin-profile" style={{ textDecoration: 'none', color: 'white', fontSize: '18px' }}>
            Profile
          </Link>
        </li>
        <li style={{ display: 'inline-block', margin: '0 15px' }}>
          <Link to="/user-management" style={{ textDecoration: 'none', color: 'white', fontSize: '18px' }}>
            Users
          </Link>
        </li>
        <li style={{ display: 'inline-block', margin: '0 15px' }}>
          <Link to="/admin-donations" style={{ textDecoration: 'none', color: 'white', fontSize: '18px' }}>
            Donations
          </Link>
        </li>
        <li style={{ display: 'inline-block', margin: '0 15px' }}>
          <Link to="/logout" style={{ textDecoration: 'none', color: 'white', fontSize: '18px' }}>
            Logout
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default UserHeader;
