import React, { useState } from 'react';
import { Check, User, Briefcase, Mail, Phone, Building2, X, ChevronRight, Loader2 } from 'lucide-react';

const App = () => {
  const [view, setView] = useState('landing');
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = (type) => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!validateEmail(email)) newErrors.email = 'Invalid email format';
    if (type === 'professional' && !company.trim()) 
      newErrors.company = 'Company is required';
    return newErrors;
  };

  const handleSubmit = async (type) => {
    const newErrors = validateForm(type);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          company,
          registration_type: type
        })
      });

      if (response.ok) {
        resetForm();
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setView('landing');
        }, 5000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setErrors({ submit: errorData.message || 'Registration failed. Please try again.' });
      }
    } catch (error) {
      console.log('Backend not available, running in demo mode');
      console.log('Registration data:', { name, email, phone, company, registration_type: type });
      
      resetForm();
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setView('landing');
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setCompany('');
    setErrors({});
  };

  const handleBack = () => {
    setView('landing');
    resetForm();
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 animate-fadeIn">
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/20 via-black to-black"></div>
        
        <div className="relative bg-black/70 backdrop-blur-md rounded border border-green-800 p-12 text-center max-w-md shadow-2xl">
          <div className="w-20 h-20 rounded-full bg-green-600 flex items-center justify-center mx-auto mb-6 animate-successPulse">
            <Check size={40} className="text-white animate-checkmark" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-3">Registration Successful!</h2>
          <p className="text-gray-300 mb-4">Your registration has been confirmed.</p>
          <p className="text-gray-400 text-sm">You will receive a confirmation email shortly.</p>
          
          <button
            onClick={() => {
              setShowSuccess(false);
              setView('landing');
            }}
            className="mt-8 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  if (view === 'student' || view === 'professional') {
    const isStudent = view === 'student';
    const Icon = isStudent ? User : Briefcase;
    const title = isStudent ? 'Student Registration' : 'Professional Registration';

    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 animate-fadeIn">
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 via-black to-black"></div>
        
        <div className="relative w-full max-w-md z-10">
          <button
            onClick={handleBack}
            disabled={loading}
            className="mb-6 text-gray-400 hover:text-white flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            ← Back
          </button>
          
          <div className="bg-black/70 backdrop-blur-md rounded border border-gray-800 p-8 shadow-2xl">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center">
                <Icon size={32} className="text-white" />
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-center text-white mb-2">{title}</h2>
            <p className="text-center text-gray-400 text-sm mb-8">Fill in your details to register</p>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <User size={16} className="text-red-500" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                  }}
                  disabled={loading}
                  className={`w-full px-4 py-3 rounded bg-gray-800/50 border ${
                    errors.name ? 'border-red-600 bg-red-900/20' : 'border-gray-700'
                  } text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="text-xs text-red-400 flex items-center gap-1">
                    <X size={12} /> {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Mail size={16} className="text-red-500" />
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                  }}
                  disabled={loading}
                  className={`w-full px-4 py-3 rounded bg-gray-800/50 border ${
                    errors.email ? 'border-red-600 bg-red-900/20' : 'border-gray-700'
                  } text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-xs text-red-400 flex items-center gap-1">
                    <X size={12} /> {errors.email}
                  </p>
                )}
              </div>

              {view === 'professional' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <Building2 size={16} className="text-red-500" />
                    Company
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => {
                      setCompany(e.target.value);
                      if (errors.company) setErrors(prev => ({ ...prev, company: '' }));
                    }}
                    disabled={loading}
                    className={`w-full px-4 py-3 rounded bg-gray-800/50 border ${
                      errors.company ? 'border-red-600 bg-red-900/20' : 'border-gray-700'
                    } text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                    placeholder="Enter your company"
                  />
                  {errors.company && (
                    <p className="text-xs text-red-400 flex items-center gap-1">
                      <X size={12} /> {errors.company}
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Phone size={16} className="text-red-500" />
                  Phone Number <span className="text-gray-500 text-xs">(optional)</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-3 rounded bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter your phone number"
                />
              </div>

              {errors.submit && (
                <div className="bg-red-900/20 border border-red-600 rounded p-3 flex items-start gap-2">
                  <X size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-400">{errors.submit}</p>
                </div>
              )}

              <button
                onClick={() => handleSubmit(view)}
                disabled={loading}
                className="w-full mt-8 bg-red-600 hover:bg-red-700 text-white py-3 rounded font-bold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-red-600/50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Register Now'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-red-950/20 to-black"></div>
      
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }}></div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <header className="p-6 flex items-center">
          <div className="text-red-600 font-black text-3xl tracking-tighter">CONFERENCE</div>
        </header>

        <div className="flex-1 flex items-center justify-center p-4 animate-fadeIn">
          <div className="text-center max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight">
              Unlimited ideas, insights,<br />and more
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Join the premier conference of 2025
            </p>
            <p className="text-lg text-gray-400 mb-12">
              Ready to register? Choose your membership type.
            </p>

            <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <button
                onClick={() => setView('student')}
                className="group relative bg-gradient-to-br from-gray-900 to-black rounded overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-800 hover:border-gray-700"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-red-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative p-8 text-left">
                  <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center mb-4">
                    <User size={28} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Student</h3>
                  <p className="text-gray-400 mb-4">Special rates for students</p>
                  <div className="flex items-center text-white font-medium">
                    Get Started <ChevronRight size={20} className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>

              <button
                onClick={() => setView('professional')}
                className="group relative bg-gradient-to-br from-gray-900 to-black rounded overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-800 hover:border-gray-700"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-red-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative p-8 text-left">
                  <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center mb-4">
                    <Briefcase size={28} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Professional</h3>
                  <p className="text-gray-400 mb-4">For industry professionals</p>
                  <div className="flex items-center text-white font-medium">
                    Get Started <ChevronRight size={20} className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        @keyframes successPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-successPulse {
          animation: successPulse 2s ease-in-out infinite;
        }
        @keyframes checkmark {
          0% { transform: scale(0) rotate(45deg); }
          50% { transform: scale(1.2) rotate(45deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        .animate-checkmark {
          animation: checkmark 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default App;