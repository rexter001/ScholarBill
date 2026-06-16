import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const res = await api.get('/subscriptions');
        setSubscription(res.data);
      } catch (err) {
        console.error('Failed to load subscription status.');
      } finally {
        setLoading(false);
      }
    };
    fetchSubscription();
  }, []);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">User Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-lg font-bold text-gray-700 mb-4">Account Information</h2>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-medium text-gray-800">Name:</span> {user?.name}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium text-gray-800">Email:</span> {user?.email}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium text-gray-800">Account Type:</span>{' '}
                  <span className="capitalize">{user?.role}</span>
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-700 mb-4">Current Subscription</h2>
                {loading ? (
                  <div className="h-10 w-24 bg-gray-200 animate-pulse rounded"></div>
                ) : subscription ? (
                  <div>
                    <p className="text-2xl font-extrabold text-indigo-600">
                      {subscription.plan.name}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Billing Status:{' '}
                      <span className="bg-green-100 text-green-800 font-semibold text-xs px-2.5 py-0.5 rounded-full uppercase">
                        {subscription.status}
                      </span>
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Active Since: {new Date(subscription.startDate).toLocaleDateString()}
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-500 italic">No active subscription found.</p>
                    <p className="text-sm text-gray-400 mt-1">Please select an available plan to begin using our portal benefits.</p>
                  </div>
                )}
              </div>
              <div className="mt-6">
                <Link
                  to="/plans"
                  className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition"
                >
                  {subscription ? 'Change Plan' : 'Browse Plans'}
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;