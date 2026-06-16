import React, { useEffect, useState } from 'react';
import api from '../api';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalPlans: 0, activeSubscriptions: 0 });
  const [users, setUsers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsRes, usersRes, subsRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/users'),
          api.get('/admin/subscriptions'),
        ]);
        setStats(statsRes.data);
        setUsers(usersRes.data);
        setSubscriptions(subsRes.data);
      } catch (err) {
        console.error('Failed to load administrative analytics.');
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Panel</h1>

          {loading ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="bg-white h-24 animate-pulse rounded-xl border border-gray-200"></div>
                ))}
              </div>
              <div className="bg-white h-64 animate-pulse rounded-xl border border-gray-200"></div>
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <span className="block text-sm text-gray-400 font-semibold uppercase">Total Users</span>
                  <span className="text-3xl font-extrabold text-gray-900 mt-2 block">
                    {stats.totalUsers}
                  </span>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <span className="block text-sm text-gray-400 font-semibold uppercase">Total System Plans</span>
                  <span className="text-3xl font-extrabold text-indigo-600 mt-2 block">
                    {stats.totalPlans}
                  </span>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <span className="block text-sm text-gray-400 font-semibold uppercase">Active Subscriptions</span>
                  <span className="text-3xl font-extrabold text-green-600 mt-2 block">
                    {stats.activeSubscriptions}
                  </span>
                </div>
              </div>

              {/* Subscriptions Table */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8 overflow-hidden">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Users & Subscriptions Details</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-400 font-semibold uppercase text-xs">
                        <th className="pb-3">User Name</th>
                        <th className="pb-3">Email Address</th>
                        <th className="pb-3">Plan Subscribed</th>
                        <th className="pb-3">Billing Status</th>
                        <th className="pb-3 text-right">Start Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                      {subscriptions.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="py-4 text-center text-gray-400 italic">No subscriptions registered yet.</td>
                        </tr>
                      ) : (
                        subscriptions.map((sub) => (
                          <tr key={sub._id}>
                            <td className="py-3 font-medium text-gray-900">{sub.user?.name || 'N/A'}</td>
                            <td className="py-3">{sub.user?.email || 'N/A'}</td>
                            <td className="py-3 text-indigo-600 font-medium">{sub.plan?.name || 'N/A'}</td>
                            <td className="py-3">
                              <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-0.5 rounded-full uppercase">
                                {sub.status}
                              </span>
                            </td>
                            <td className="py-3 text-right text-gray-500">
                              {new Date(sub.startDate).toLocaleDateString()}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* General User Accounts */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 overflow-hidden">
                <h2 className="text-lg font-bold text-gray-900 mb-4 font-sans">Registered Accounts List</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-400 font-semibold uppercase text-xs">
                        <th className="pb-3">Account Name</th>
                        <th className="pb-3">Email</th>
                        <th className="pb-3">Assigned Privilege</th>
                        <th className="pb-3 text-right">Created At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                      {users.map((userObj) => (
                        <tr key={userObj._id}>
                          <td className="py-3 font-semibold text-gray-900">{userObj.name}</td>
                          <td className="py-3">{userObj.email}</td>
                          <td className="py-3">
                            <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full ${userObj.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                              {userObj.role}
                            </span>
                          </td>
                          <td className="py-3 text-right text-gray-500">
                            {new Date(userObj.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;