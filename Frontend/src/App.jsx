import React, { useState } from 'react';
import { Check, User, Briefcase, Mail, Phone, Building2, X, ChevronRight } from 'lucide-react';

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
    try {
      const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          registration_type: type
        })
      });

      if (response.ok) {
        setShowSuccess(true);
        setFormData({ name: '', email: '', phone: '', company: '' });
        setTimeout(() => {
          setShowSuccess(false);
          setView('landing');
        }, 3000);
      }
    } catch (error) {
      console.error('Registration error:', error);
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
        className={`w-full px-4 py-3 rounded bg-gray-800/50 border ${
          errors[name] ? 'border-red-600 bg-red-900/20' : 'border-gray-700'
        } text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all duration-200`}
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
          onClick={() => setView('landing')}
          className="mb-6 text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
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

            <button
              onClick={() => handleSubmit(type)}
              disabled={loading}
              className="w-full mt-8 bg-red-600 hover:bg-red-700 text-white py-3 rounded font-bold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-red-600/50"
            >
              {loading ? 'Submitting...' : 'Register Now'}
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
        
        <div className="relative bg-black/70 backdrop-blur-md rounded border border-gray-800 p-12 text-center max-w-md shadow-2xl">
          <div className="w-20 h-20 rounded-full bg-green-600 flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Check size={40} className="text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-3">Success!</h2>
          <p className="text-gray-300">Your registration has been confirmed.</p>
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
      `}</style>
    </div>
  );
};

export default App;