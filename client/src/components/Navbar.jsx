import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user } = useContext(AuthContext);

  return (
    <nav className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
      <div className="font-semibold text-gray-800 text-lg">
        {user?.role === 'admin' ? 'Admin Portal' : 'User Billing Area'}
      </div>
      <div className="flex items-center gap-4">
        <span className="text-gray-600">
          Welcome, <span className="font-semibold text-gray-900">{user?.name}</span>
        </span>
        <span className="px-3 py-1 text-xs font-bold rounded-full bg-indigo-100 text-indigo-800 uppercase">
          {user?.role}
        </span>
      </div>
    </nav>
  );
};

export default Navbar;