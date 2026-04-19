import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { careersData } from '../data/careers';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCareers, setFilteredCareers] = useState(careersData);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const filtered = careersData.filter((career) =>
      career.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCareers(filtered);
  }, [searchTerm]);

  const handleCareerClick = (career) => {
    navigate(`/roadmap/${career.id}`, { state: { career } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-slate-900 to-[#0F172A] px-6 py-12">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Welcome, {user?.name}!</h1>
            <p className="text-gray-400">Explore your path to success</p>
          </div>
          <button
            onClick={() => navigate('/profile')}
            className="px-6 py-3 bg-[#10B981] text-white rounded-lg hover:bg-[#0EA572] transition"
          >
            Profile
          </button>
        </div>

        {/* Search */}
        <div className="mb-12">
          <input
            type="text"
            placeholder="Search careers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#10B981] transition"
          />
        </div>

        {/* Career Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCareers.map((career) => (
            <div
              key={career.id}
              onClick={() => handleCareerClick(career)}
              className="group backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 cursor-pointer hover:border-[#10B981] transition-all duration-300 hover:shadow-xl hover:shadow-[#10B981]/20"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition">{career.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{career.title}</h3>
              <p className="text-gray-300 text-sm mb-4">{career.description}</p>
              <div className="flex flex-wrap gap-2">
                {career.interests.slice(0, 2).map((interest) => (
                  <span
                    key={interest}
                    className="px-3 py-1 bg-[#10B981]/20 text-[#10B981] text-xs rounded-full"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredCareers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No careers found. Try a different search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;