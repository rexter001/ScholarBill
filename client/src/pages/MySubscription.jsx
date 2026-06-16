import React, { useEffect, useState } from 'react';
import api from '../api';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const MySubscription = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const res = await api.get('/subscriptions');
        setSubscription(res.data);
      } catch (err) {
        console.error('Failed to fetch subscription parameters.');
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
          <h1 className="text-3xl font-bold text-gray-800 mb-6">My Subscription Details</h1>

          {loading ? (
            <div className="bg-white rounded-xl border border-gray-200 h-64 animate-pulse"></div>
          ) : subscription ? (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm max-w-2xl">
              <div className="border-b border-gray-100 p-6 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{subscription.plan.name}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Activated on {new Date(subscription.startDate).toLocaleDateString()}
                  </p>
                </div>
                <span className="bg-green-100 text-green-800 font-semibold text-xs px-3 py-1 rounded-full uppercase">
                  {subscription.status}
                </span>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-xs text-gray-400 uppercase font-semibold">Price rate</span>
                    <span className="text-lg font-bold text-gray-800">₹{subscription.plan.price}/month</span>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-400 uppercase font-semibold">Owner email</span>
                    <span className="text-gray-800 font-medium">{subscription.user.email}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <span className="block text-xs text-gray-400 uppercase font-semibold mb-1">Plan details</span>
                  <p className="text-sm text-gray-600 leading-relaxed">{subscription.plan.description}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center max-w-2xl">
              <div className="mx-auto w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500 font-bold mb-4">
                i
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">No Active Subscription</h3>
              <p className="text-gray-500 mb-4">
                You currently don't have an active subscription plan assigned to your account.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MySubscription;