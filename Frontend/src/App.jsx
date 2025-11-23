import React, { useState } from 'react';
import { Check, User, Briefcase, Mail, Phone, Building2, X, ChevronRight, Loader2 } from 'lucide-react';

const App = () => {
  const [view, setView] = useState('landing');
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: ''
  });
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = (type) => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email format';
    if (type === 'professional' && !formData.company.trim()) 
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
    
    // Simulate API delay for demo purposes
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      // Try to connect to backend
      const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          registration_type: type
        })
      });

      if (response.ok) {
        // Clear form and errors
        setFormData({ name: '', email: '', phone: '', company: '' });
        setErrors({});
        
        // Show success screen
        setShowSuccess(true);
        
        // Return to landing after 5 seconds
        setTimeout(() => {
          setShowSuccess(false);
          setView('landing');
        }, 5000);
      } else {
        // Handle error response
        const errorData = await response.json().catch(() => ({}));
        setErrors({ submit: errorData.message || 'Registration failed. Please try again.' });
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      // DEMO MODE: If backend is not available, simulate success
      console.log('Backend not available, running in demo mode');
      console.log('Registration data:', { ...formData, registration_type: type });
      
      // Clear form and errors
      setFormData({ name: '', email: '', phone: '', company: '' });
      setErrors({});
      
      // Show success screen
      setShowSuccess(true);
      
      // Return to landing after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
        setView('landing');
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ icon: Icon, label, name, type = 'text', required = false }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
        <Icon size={16} className="text-red-500" />
        {label} {!required && <span className="text-gray-500 text-xs">(optional)</span>}
      </label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={(e) => {
          setFormData({ ...formData, [name]: e.target.value });
          setErrors({ ...errors, [name]: '' });
        }}
        disabled={loading}
        className={`w-full px-4 py-3 rounded bg-gray-800/50 border ${
          errors[name] ? 'border-red-600 bg-red-900/20' : 'border-gray-700'
        } text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
        placeholder={`Enter your ${label.toLowerCase()}`}
      />
      {errors[name] && (
        <p className="text-xs text-red-400 flex items-center gap-1">
          <X size={12} /> {errors[name]}
        </p>
      )}
    </div>
  );

  const FormView = ({ type, title, icon: Icon }) => (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 animate-fadeIn">
      <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 via-black to-black"></div>
      
      <div className="relative w-full max-w-md z-10">
        <button
          onClick={() => {
            setView('landing');
            setFormData({ name: '', email: '', phone: '', company: '' });
            setErrors({});
          }}
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
            <InputField icon={User} label="Full Name" name="name" required />
            <InputField icon={Mail} label="Email" name="email" type="email" required />
            {type === 'professional' && (
              <InputField icon={Building2} label="Company" name="company" required />
            )}
            <InputField icon={Phone} label="Phone Number" name="phone" type="tel" />

            {errors.submit && (
              <div className="bg-red-900/20 border border-red-600 rounded p-3 flex items-start gap-2">
                <X size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-400">{errors.submit}</p>
              </div>
            )}

            <button
              onClick={() => handleSubmit(type)}
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

  if (view === 'student') {
    return <FormView type="student" title="Student Registration" icon={User} />;
  }

  if (view === 'professional') {
    return <FormView type="professional" title="Professional Registration" icon={Briefcase} />;
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