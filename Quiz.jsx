import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const quizQuestions = {
  Tech: [
    {
      id: 1,
      question: 'How comfortable are you with coding?',
      careerMatches: { 'Software Engineer': 5, 'Data Scientist': 4, 'Entrepreneur': 3 },
      options: [
        'Very comfortable',
        'Somewhat comfortable',
        'Learning',
        'Not interested',
      ],
    },
    {
      id: 2,
      question: 'Do you enjoy working with databases and data?',
      careerMatches: { 'Data Scientist': 5, 'Software Engineer': 3, 'Entrepreneur': 2 },
      options: ['Yes, very much', 'Sometimes', 'Rarely', 'No'],
    },
  ],
  Arts: [
    {
      id: 3,
      question: 'How creative are you?',
      careerMatches: { 'Graphic Designer': 5, 'Content Writer': 4, 'Lawyer': 2 },
      options: [
        'Very creative',
        'Moderately creative',
        'Somewhat creative',
        'Not creative',
      ],
    },
  ],
  Medical: [
    {
      id: 4,
      question: 'How do you feel about science and biology?',
      careerMatches: { 'Doctor (MBBS)': 5, 'Pharmacist': 4 },
      options: ['Love it', 'Like it', 'Neutral', 'Dislike it'],
    },
  ],
  Law: [
    {
      id: 5,
      question: 'Are you interested in justice and law?',
      careerMatches: { 'Lawyer': 5, 'Chartered Accountant (CA)': 2 },
      options: ['Highly interested', 'Interested', 'Somewhat', 'Not interested'],
    },
  ],
  Finance: [
    {
      id: 6,
      question: 'How good are you with numbers and finance?',
      careerMatches: {
        'Investment Banker': 5,
        'Chartered Accountant (CA)': 5,
        'Entrepreneur': 3,
      },
      options: ['Excellent', 'Good', 'Average', 'Poor'],
    },
  ],
  Engineering: [
    {
      id: 7,
      question: 'Do you like building and designing things?',
      careerMatches: { 'Mechanical Engineer': 5, 'Software Engineer': 4 },
      options: ['Yes, definitely', 'Yes', 'Sometimes', 'No'],
    },
  ],
  Business: [
    {
      id: 8,
      question: 'Would you like to start your own business?',
      careerMatches: { 'Entrepreneur': 5, 'Investment Banker': 3, 'Content Writer': 2 },
      options: [
        'Definitely',
        'Maybe',
        'Not sure',
        'No',
      ],
    },
  ],
  Science: [
    {
      id: 9,
      question: 'How interested are you in research?',
      careerMatches: { 'Data Scientist': 4, 'Doctor (MBBS)': 3, 'Mechanical Engineer': 2 },
      options: ['Very interested', 'Interested', 'Somewhat', 'Not interested'],
    },
  ],
};

const Quiz = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [careerScores, setCareerScores] = useState({});

  const allQuestions = [];
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);

      // Generate questions based on user interests
      parsedUser.interests.forEach((interest) => {
        if (quizQuestions[interest]) {
          allQuestions.push(...quizQuestions[interest]);
        }
      });
    }
  }, []);

  const userInterests = user?.interests || [];
  const filteredQuestions = [];
  userInterests.forEach((interest) => {
    if (quizQuestions[interest]) {
      filteredQuestions.push(...quizQuestions[interest]);
    }
  });

  const currentQuestion = filteredQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / filteredQuestions.length) * 100;

  const handleAnswerClick = (answerIndex) => {
    if (!currentQuestion) return;

    const scores = { ...careerScores };
    const matchPoints = Object.entries(currentQuestion.careerMatches);

    matchPoints.forEach(([career, baseScore]) => {
      const points = baseScore - answerIndex * 0.5;
      scores[career] = (scores[career] || 0) + Math.max(0, points);
    });

    setCareerScores(scores);

    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      submitQuiz(scores);
    }
  };

  const submitQuiz = async (finalScores) => {
    setLoading(true);

    // Calculate top match
    const sortedCareers = Object.entries(finalScores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    const topMatch = sortedCareers[0];
    const quizResult = {
      topMatch: topMatch[0],
      matchScore: Math.round((topMatch[1] / 25) * 100),
      allMatches: sortedCareers.map(([career, score]) => ({
        career,
        score: Math.round((score / 25) * 100),
      })),
    };

    // Save to database
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/quiz/submit`,
        { quizResult },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.error('Error saving quiz result:', err);
    }

    setResults(quizResult);
    setLoading(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-slate-900 to-[#0F172A] flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-2xl font-bold mb-4">Please log in to take the quiz</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-[#10B981] text-white rounded-lg hover:bg-[#0EA572] transition"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  if (results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-slate-900 to-[#0F172A] flex items-center justify-center px-6 py-12">
        <div className="max-w-2xl w-full backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">🎉 Your Perfect Match!</h1>
            <div className="mb-8 p-8 bg-gradient-to-br from-[#10B981]/20 to-[#10B981]/5 border border-[#10B981]/30 rounded-xl">
              <h2 className="text-3xl font-bold text-[#10B981] mb-2">{results.topMatch}</h2>
              <p className="text-4xl font-bold text-white">{results.matchScore}% Match</p>
            </div>

            <h3 className="text-xl font-bold text-white mb-4">All Matches:</h3>
            <div className="space-y-3 mb-8">
              {results.allMatches.map((match, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white/10 p-4 rounded-lg">
                  <span className="text-white font-medium">{match.career}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#10B981] rounded-full transition-all"
                        style={{ width: `${match.score}%` }}
                      ></div>
                    </div>
                    <span className="text-[#10B981] font-bold w-12 text-right">{match.score}%</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/dashboard')}
              className="px-8 py-4 bg-[#10B981] text-white rounded-lg font-bold hover:bg-[#0EA572] transition"
            >
              Start Your Journey
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-slate-900 to-[#0F172A] flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-2xl font-bold mb-4">No questions available for your interests</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-[#10B981] text-white rounded-lg hover:bg-[#0EA572] transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-slate-900 to-[#0F172A] flex items-center justify-center px-6 py-12">
      <div className="max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-[#10B981] to-[#059669] rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-gray-400 text-sm">
            Question {currentQuestionIndex + 1} of {filteredQuestions.length}
          </p>
        </div>

        {/* Question Card */}
        <div className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-white mb-8">{currentQuestion.question}</h2>

          {/* Answer Options */}
          <div className="space-y-4">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerClick(index)}
                disabled={loading}
                className="w-full px-6 py-4 text-left bg-white/10 border border-white/20 rounded-lg text-white hover:bg-[#10B981]/20 hover:border-[#10B981] transition disabled:opacity-50"
              >
                <span className="font-medium">{option}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;