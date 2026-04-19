import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserProfileById, updateUserProfile } from './supabaseUserService';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  const interestOptions = [
    'Tech', 'Arts', 'Medical', 'Law', 'Finance', 'Engineering', 'Business', 'Science',
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        navigate('/login');
        return;
      }

      const parsedUser = JSON.parse(userData);
      const profile = await fetchUserProfileById(parsedUser.id);
      
      setUser(profile);
      setEditData(profile);
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const handleInterestToggle = (interest) => {
    setEditData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const userData = localStorage.getItem('user');
      const parsedUser = JSON.parse(userData);

      await updateUserProfile(parsedUser.id, {
        name: editData.name,
        current_standard: editData.current_standard,
        interests: editData.interests,
        updated_at: new Date(),
      });

      setUser(editData);
      localStorage.setItem('user', JSON.stringify(editData));
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-slate-900 to-[#0F172A] flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-2xl font-bold mb-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-slate-900 to-[#0F172A] px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-8 px-4 py-2 text-gray-400 hover:text-white transition"
        >
          ← Back
        </button>

        {/* Profile Header */}
        <div className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white">{user.name}</h1>
              <p className="text-gray-400 mt-2">{user.email}</p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-6 py-3 bg-[#10B981] text-white rounded-lg hover:bg-[#0EA572] transition"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {!isEditing ? (
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm">Academic Standard</p>
                <p className="text-white font-semibold">{user.current_standard}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Interests</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {user.interests?.map((interest) => (
                    <span
                      key={interest}
                      className="px-3 py-1 bg-[#10B981]/20 text-[#10B981] rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm block mb-2">Name</label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#10B981]"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-2">Academic Standard</label>
                <select
                  value={editData.current_standard}
                  onChange={(e) => setEditData({ ...editData, current_standard: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#10B981]"
                >
                  <option value="10th">10th</option>
                  <option value="12th">12th</option>
                  <option value="UG">UG</option>
                  <option value="Postgraduate">Postgraduate</option>
                  <option value="Professional">Professional</option>
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-2">Interests</label>
                <div className="grid grid-cols-2 gap-2">
                  {interestOptions.map((interest) => (
                    <button
                      key={interest}
                      onClick={() => handleInterestToggle(interest)}
                      className={`px-3 py-2 rounded-lg text-sm transition ${
                        editData.interests?.includes(interest)
                          ? 'bg-[#10B981] text-white'
                          : 'bg-white/10 text-gray-300 border border-white/20'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={handleSaveProfile}
                disabled={loading}
                className="w-full px-6 py-3 bg-[#10B981] text-white rounded-lg font-medium hover:bg-[#0EA572] transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
