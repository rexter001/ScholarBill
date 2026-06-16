import React, { useEffect, useState } from 'react';
import api from '../api';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const AdminPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [editingPlan, setEditingPlan] = useState(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const loadPlans = async () => {
    try {
      const res = await api.get('/plans');
      setPlans(res.data);
    } catch (err) {
      console.error('Failed to list existing systems plans.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || price === '' || !description) {
      setError('Please provide all parameters.');
      return;
    }

    try {
      if (editingPlan) {
        // Edit flow
        await api.put(`/plans/${editingPlan._id}`, { name, price: Number(price), description });
      } else {
        // Create flow
        await api.post('/plans', { name, price: Number(price), description });
      }
      // Reset variables
      setName('');
      setPrice('');
      setDescription('');
      setEditingPlan(null);
      loadPlans();
    } catch (err) {
      setError(err.response?.data?.message || 'Transaction could not go through. Please trace attributes.');
    }
  };

  const handleEditClick = (plan) => {
    setEditingPlan(plan);
    setName(plan.name);
    setPrice(plan.price);
    setDescription(plan.description);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you absolutely sure you want to drop this plan configuration?')) {
      try {
        await api.delete(`/plans/${id}`);
        loadPlans();
      } catch (err) {
        alert('Plan removal actions aborted. Some internal constraints triggered error.');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingPlan(null);
    setName('');
    setPrice('');
    setDescription('');
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Subscription Plans Configuration</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Plan CRUD Form */}
            <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                {editingPlan ? 'Edit Billing Configuration' : 'Create Custom Plan'}
              </h2>

              {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-xs font-semibold border border-red-200">
                  {error}
                </div>
              )}

              <form onSubmit={handleCreateOrUpdate} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Plan Identifier Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Standard, Master, Pro Tier"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Monthly Cost (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="Monthly price tag index"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Plan Description Summary</label>
                  <textarea
                    required
                    rows="3"
                    placeholder="Write detailed tier offerings, specifications..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg text-sm transition"
                  >
                    {editingPlan ? 'Apply Updates' : 'Add Plan Schema'}
                  </button>
                  {editingPlan && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-3 py-2 rounded-lg text-sm transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Current Plans Grid */}
            <div className="lg:col-span-2">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Active System Plan Frameworks</h2>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2].map((n) => (
                    <div key={n} className="bg-white h-48 animate-pulse rounded-xl border border-gray-200"></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {plans.map((plan) => (
                    <div
                      key={plan._id}
                      className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl font-bold text-gray-950">{plan.name}</h3>
                          <span className="text-lg font-extrabold text-indigo-600">₹{plan.price}</span>
                        </div>
                        <p className="text-gray-600 text-sm mt-3 line-clamp-3">{plan.description}</p>
                      </div>

                      <div className="flex gap-3 mt-6 border-t border-gray-100 pt-4">
                        <button
                          onClick={() => handleEditClick(plan)}
                          className="flex-1 text-center bg-gray-50 hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 text-xs font-bold py-2 rounded transition"
                        >
                          Modify Structure
                        </button>
                        <button
                          onClick={() => handleDeleteClick(plan._id)}
                          className="flex-1 text-center bg-gray-50 hover:bg-red-50 text-gray-700 hover:text-red-700 text-xs font-bold py-2 rounded transition"
                        >
                          Remove Plan
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPlans;