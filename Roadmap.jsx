import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

const Roadmap = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { career } = location.state || {};

  const [activePhase, setActivePhase] = useState(0);

  if (!career) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-slate-900 to-[#0F172A] flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-2xl font-bold mb-4">Career not found</p>
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
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-slate-900 to-[#0F172A] px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-8 px-4 py-2 text-gray-400 hover:text-white transition"
        >
          ← Back
        </button>

        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-6xl">{career.icon}</span>
            <div>
              <h1 className="text-4xl font-bold text-white">{career.title}</h1>
              <p className="text-gray-400 mt-2">{career.description}</p>
            </div>
          </div>
        </div>

        {/* Timeline Phases */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-8">Your Learning Journey</h2>

          <div className="space-y-8">
            {career.roadmap.phases.map((phase, index) => (
              <div
                key={index}
                className="relative backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-8 hover:border-[#10B981] transition"
              >
                {/* Timeline Dot */}
                <div className="absolute -left-6 top-8 w-12 h-12 bg-[#10B981] rounded-full flex items-center justify-center border-4 border-[#0F172A]">
                  <span className="text-white font-bold">{index + 1}</span>
                </div>

                {/* Phase Content */}
                <div className="ml-8">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white">{phase.phase}</h3>
                      <p className="text-[#10B981] font-semibold">{phase.duration}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-200 mb-3">Requirements:</h4>
                    <ul className="space-y-2">
                      {phase.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-gray-300">
                          <span className="text-[#10B981] mt-1">✓</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Connector Line */}
                {index < career.roadmap.phases.length - 1 && (
                  <div className="absolute -left-2 top-20 w-1 h-16 bg-gradient-to-b from-[#10B981] to-transparent"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Exams Required */}
        {career.roadmap.exams.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Competitive Exams</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {career.roadmap.exams.map((exam, idx) => (
                <div
                  key={idx}
                  className="backdrop-blur-md bg-white/10 border border-white/20 rounded-lg p-4 text-white text-center"
                >
                  📝 {exam}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Essential Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {career.roadmap.skills.map((skill, idx) => (
              <div
                key={idx}
                className="backdrop-blur-md bg-gradient-to-br from-[#10B981]/20 to-[#10B981]/5 border border-[#10B981]/30 rounded-lg p-4 text-white text-center"
              >
                {skill}
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Recommended Certifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {career.roadmap.certifications.map((cert, idx) => (
              <div
                key={idx}
                className="backdrop-blur-md bg-white/10 border border-white/20 rounded-lg p-4 text-white"
              >
                <p className="font-semibold">🎓 {cert}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Start Journey Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => navigate('/quiz')}
            className="px-8 py-4 bg-gradient-to-r from-[#10B981] to-[#059669] text-white rounded-lg font-bold text-lg hover:shadow-lg hover:shadow-[#10B981]/50 transition"
          >
            Start This Journey 🚀
          </button>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;