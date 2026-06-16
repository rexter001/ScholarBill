import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col min-h-screen">
      <div className="p-6 text-2xl font-bold border-b border-slate-800 text-indigo-400">
        ScholarBill
      </div>
      <div className="flex-1 p-4 space-y-2">
        {user?.role === 'user' ? (
          <>
            <Link
              to="/dashboard"
              className={`block px-4 py-2.5 rounded-lg transition-colors ${isActive('/dashboard') ? 'bg-indigo-600' : 'hover:bg-slate-800'
                }`}
            >
              Dashboard
            </Link>
            <Link
              to="/plans"
              className={`block px-4 py-2.5 rounded-lg transition-colors ${isActive('/plans') ? 'bg-indigo-600' : 'hover:bg-slate-800'
                }`}
            >
              Available Plans
            </Link>
            <Link
              to="/subscription"
              className={`block px-4 py-2.5 rounded-lg transition-colors ${isActive('/subscription') ? 'bg-indigo-600' : 'hover:bg-slate-800'
                }`}
            >
              My Subscription
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/admin/dashboard"
              className={`block px-4 py-2.5 rounded-lg transition-colors ${isActive('/admin/dashboard') ? 'bg-indigo-600' : 'hover:bg-slate-800'
                }`}
            >
              Admin Dashboard
            </Link>
            <Link
              to="/admin/plans"
              className={`block px-4 py-2.5 rounded-lg transition-colors ${isActive('/admin/plans') ? 'bg-indigo-600' : 'hover:bg-slate-800'
                }`}
            >
              Manage Plans
            </Link>
          </>
        )}
      </div>
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={logout}
          className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-red-600 hover:text-white text-gray-400 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;