import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    currentStandard: '10th',
    interests: [],
  });

  const standards = ['10th', '12th', 'UG', 'Postgraduate', 'Professional'];
  const interestOptions = [
    'Tech',
    'Arts',
    'Medical',
    'Law',
    'Finance',
    'Engineering',
    'Business',
    'Science',
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInterestToggle = (interest) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleNextStep = () => {
    setError('');
    if (step === 1) {
      if (!formData.email || !formData.password || !formData.confirmPassword) {
        setError('All fields are required');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!formData.name || !formData.currentStandard) {
        setError('All fields are required');
        return;
      }
      setStep(3);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.interests.length === 0) {
      setError('Please select at least one interest');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/signup`,
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          currentStandard: formData.currentStandard,
          interests: formData.interests,
        }
      );

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-slate-900 to-[#0F172A] flex items-center justify-center px-4">
      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 w-full max-w-md shadow-2xl">
        {/* Progress Indicator */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((num) => (
            <div
              key={num}
              className={`h-1 flex-1 rounded-full transition-all ${
                step >= num ? 'bg-[#10B981]' : 'bg-white/20'
              }`}
            ></div>
          ))}
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">PathFinder</h1>
        <p className="text-gray-300 mb-8">Step {step} of 3</p>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Step 1: Credentials */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white mb-6">Basic Credentials</h2>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#10B981] transition"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#10B981] transition"
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#10B981] transition"
            />
          </div>
        )}

        {/* Step 2: Academic Standard */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white mb-6">Academic Standard</h2>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#10B981] transition"
            />
            <select
              name="currentStandard"
              value={formData.currentStandard}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#10B981] transition"
            >
              {standards.map((std) => (
                <option key={std} value={std}>
                  {std}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Step 3: Interests */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white mb-6">Select Your Interests</h2>
            <div className="grid grid-cols-2 gap-3">
              {interestOptions.map((interest) => (
                <button
                  key={interest}
                  onClick={() => handleInterestToggle(interest)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    formData.interests.includes(interest)
                      ? 'bg-[#10B981] text-white'
                      : 'bg-white/10 text-gray-300 border border-white/20 hover:border-[#10B981]'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 px-6 py-3 border border-white/20 text-white rounded-lg font-medium hover:bg-white/10 transition"
            >
              Back
            </button>
          )}
          <button
            onClick={step === 3 ? handleSubmit : handleNextStep}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-[#10B981] text-white rounded-lg font-medium hover:bg-[#0EA572] transition disabled:opacity-50"
          >
            {loading ? 'Processing...' : step === 3 ? 'Create Account' : 'Next'}
          </button>
        </div>

        <p className="text-center text-gray-400 mt-6">
          Already have an account?{' '}
          <a href="/login" className="text-[#10B981] hover:underline font-medium">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;