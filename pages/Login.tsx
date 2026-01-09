
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const Login: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: phone, 2: otp
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // If user is already logged in, redirect them
  useEffect(() => {
    if (user?.isAuthenticated) {
      navigate(user.isAdmin ? '/admin' : '/');
    }
  }, [user, navigate]);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Simple phone validation
    if (phone.length < 8) {
      setError('Please enter a valid phone number');
      setLoading(false);
      return;
    }

    try {
      await apiService.requestOtp(phone);
      setStep(2);
    } catch (err: any) {
      setError(err.message || 'Error requesting OTP. Is the backend URL configured?');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (otp.length !== 6) {
      setError('Please enter the 6-digit code');
      setLoading(false);
      return;
    }

    try {
      const response = await apiService.verifyOtp(phone, otp);
      // Assuming response contains { token, isAdmin }
      // If backend doesn't provide isAdmin, we can use our dummy logic
      const isAdmin = response.isAdmin ?? phone.endsWith('00');
      
      login({ 
        phone, 
        token: response.token, 
        isAdmin 
      });

      // Navigation is handled by the useEffect above, but we can also trigger it here
      navigate(isAdmin ? '/admin' : '/');
    } catch (err: any) {
      setError('Invalid code. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 animate-fadeIn">
      <div className="w-full max-w-sm space-y-10">
        {/* Branding Area */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500 rounded-[28px] shadow-2xl shadow-emerald-100 mb-2">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.996-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.29-4.464c1.547.917 3.075 1.403 4.813 1.403 5.4 0 9.786-4.386 9.788-9.787 0-2.615-1.02-5.074-2.871-6.928-1.851-1.854-4.31-2.87-6.923-2.87-5.401 0-9.787 4.386-9.789 9.788 0 1.848.52 3.555 1.504 5.122l-.993 3.62 3.713-.974zm11.367-7.374c-.157-.263-.58-.419-1.217-.738-.639-.32-3.774-1.863-4.358-2.077-.583-.214-1.007-.321-1.429.321-.424.643-1.636 2.077-2.003 2.505-.367.428-.735.481-1.372.162-.637-.319-2.688-1.047-5.118-3.32-1.891-1.688-3.167-3.773-3.539-4.413-.372-.64-.04-.986.279-1.303.288-.283.639-.738.958-1.107.319-.369.424-.633.637-1.056.212-.424.106-.797-.053-1.116-.16-.319-1.429-3.444-1.957-4.714-.514-1.24-.104-1.707.158-2.042.262-.336.58-.419.897-.419.317 0 .633.003.897.003.454 0 .935-.12 1.353.491.464.678 1.585 3.844 1.724 4.13.14.286.233.619.047.994-.187.375-.281.604-.563.941-.281.336-.59.75-.844.994-.254.244-.52.511-.222.955.298.444 1.32 2.174 2.828 3.518 1.94 1.73 3.58 2.27 4.09 2.528.511.259.81.215 1.113-.127.303-.342 1.3-1.523 1.649-2.046.348-.523.696-.438 1.166-.263.47.175 2.977 1.401 3.492 1.658.514.257.857.385.983.6.126.215.126 1.24-.378 2.646-.504 1.405-2.943 2.76-4.037 2.822z"/>
            </svg>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            {step === 1 ? 'Sign In' : 'Verify Phone'}
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            {step === 1 
              ? 'Enter your WhatsApp number to receive a secure login code.' 
              : `We've sent a 6-digit code to ${phone}`}
          </p>
        </div>

        {/* Auth Form */}
        <form onSubmit={step === 1 ? handleRequestOtp : handleVerifyOtp} className="space-y-6">
          <div className="space-y-2">
            {step === 1 ? (
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <input 
                  type="tel" 
                  placeholder="e.g. +234 800 123 4567" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 pl-14 pr-6 py-5 rounded-2xl text-lg font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all"
                  required
                />
              </div>
            ) : (
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="000000" 
                  value={otp}
                  maxLength={6}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-slate-50 border border-slate-100 px-6 py-6 rounded-2xl text-3xl font-black tracking-[0.5em] text-center focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all"
                  required
                />
                <div className="flex justify-center">
                  <button 
                    type="button" 
                    onClick={() => setStep(1)} 
                    className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-emerald-600 transition-colors"
                  >
                    Change Number?
                  </button>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold border border-red-100 animate-shake">
              {error}
            </div>
          )}

          <Button 
            variant={step === 1 ? 'primary' : 'secondary'} 
            fullWidth 
            type="submit" 
            isLoading={loading}
            className={step === 2 ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-100' : ''}
          >
            {step === 1 ? 'Request Secure Code' : 'Verify & Continue'}
          </Button>
        </form>

        {/* Footer */}
        <div className="text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
            Secure WhatsApp Authentication
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
