import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [activeSub, setActiveSub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPlanData = async () => {
      try {
        const [plansRes, subRes] = await Promise.all([
          api.get('/plans'),
          api.get('/subscriptions')
        ]);
        setPlans(plansRes.data);
        setActiveSub(subRes.data);
      } catch (err) {
        console.error('Failed to grab plan details');
      } finally {
        setLoading(false);
      }
    };
    loadPlanData();
  }, []);

  const handleSubscribe = async (planId) => {
    setActionLoading(planId);
    try {
      const res = await api.post('/subscriptions', { planId });
      setActiveSub(res.data);
      navigate('/subscription');
    } catch (err) {
      alert('Subscription workflow failed. Make sure you entered valid plan reference.');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Billing Plans</h1>
          <p className="text-gray-500 mb-8">Choose a structured billing package that conforms to your operational constraints.</p>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white h-64 animate-pulse rounded-xl border border-gray-200"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => {
                const isCurrent = activeSub?.plan?._id === plan._id;
                return (
                  <div
                    key={plan._id}
                    className={`bg-white rounded-xl border p-6 flex flex-col justify-between transition shadow-sm ${isCurrent ? 'ring-2 ring-indigo-600 border-indigo-600' : 'border-gray-200'
                      }`}
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                        {isCurrent && (
                          <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2.5 py-1 rounded-full uppercase">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-3xl font-extrabold text-gray-900 mt-4 mb-1">
                        ₹{plan.price}
                        <span className="text-sm font-normal text-gray-500"> / month</span>
                      </p>
                      <p className="text-gray-600 text-sm mt-3">{plan.description}</p>
                    </div>

                    <button
                      onClick={() => handleSubscribe(plan._id)}
                      disabled={isCurrent || actionLoading !== null}
                      className={`w-full py-2.5 rounded-lg font-semibold text-sm transition mt-8 ${isCurrent
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : actionLoading === plan._id
                            ? 'bg-indigo-400 text-white cursor-wait'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow'
                        }`}
                    >
                      {isCurrent ? 'Subscribed' : actionLoading === plan._id ? 'Processing...' : 'Activate Plan'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Plans;