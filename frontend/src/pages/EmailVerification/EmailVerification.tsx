import React, { useState, useEffect, useRef } from 'react';
import { FiShield, FiMail, FiLock } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const EmailVerification: React.FC = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  // Timer effect for resend button
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isResendDisabled && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsResendDisabled(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isResendDisabled, timer]);

  const handleCodeChange = (index: number, value: string) => {
    if (value && !/^\d+$/.test(value)) return;
    
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const digits = pastedData.split('');
      const newCode = [...code];
      for (let i = 0; i < digits.length; i++) {
        if (i < 6) newCode[i] = digits[i];
      }
      setCode(newCode);
      const lastFilledIndex = Math.min(digits.length, 5);
      inputRefs.current[lastFilledIndex]?.focus();
    }
  };

  const handleVerify = async () => {
    const enteredCode = code.join('');
    if (enteredCode.length !== 6) {
      setError('Please enter the full 6-digit code');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      if (enteredCode === '123456') {
        // Navigate to verification success page
        navigate('/verified');
      } else {
        setError('Invalid verification code. Please try again.');
      }
    } catch {
      setError('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    setIsResendDisabled(true);
    setTimer(30);
    setError('');
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  // Set ref callback
  const setInputRef = (index: number) => (el: HTMLInputElement | null) => {
    inputRefs.current[index] = el;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
      {/* Main White Container */}
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        {/* Header with Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="bg-indigo-100 p-2 rounded-lg">
            <FiMail className="w-5 h-5 text-indigo-600" />
          </div>
          <span className="text-xl font-bold text-gray-800">CandidateHub</span>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-800 mb-1 text-center">VERIFY YOUR EMAIL</h2>
        <p className="text-gray-500 text-sm mb-6 text-center">
          We sent a 6-digit code to: <span className="font-medium text-gray-700">j***@example.com</span>
        </p>

        {/* 6-Digit Code Input */}
        <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
          {code.map((digit, index) => (
            <input
              key={index}
              ref={setInputRef(index)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-2xl font-semibold border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all bg-gray-50 focus:bg-white"
            />
          ))}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={isVerifying}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isVerifying ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Verifying...
            </>
          ) : (
            <>
              Verify
              <FiShield className="w-5 h-5" />
            </>
          )}
        </button>

        {/* Resend Section */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            Didn't receive the code?{' '}
            <button
              onClick={handleResendCode}
              disabled={isResendDisabled}
              className="font-medium text-indigo-600 hover:text-indigo-700 transition disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              Resend code {isResendDisabled && `(${timer}s)`}
            </button>
          </p>
        </div>

        {/* Divider */}
        <div className="mt-8 border-t border-gray-100"></div>
        {/* Secure Verification Banner - INSIDE the white container as separate div */}
        <div className="mt-5">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <FiLock className="w-4 h-4" />
            <span>Secure Verification</span>
          </div>
        </div>
      </div>
         
      <div className="mt-6">
        <p className="text-xs text-black text-center mt-2">
          To ensure the security of your TalentPulse recruitment suite, please verify your identity with the code sent to your inbox.
        </p>
      </div>
      
      {/* Footer - OUTSIDE the white container */}
      <div className="max-w-md w-full mt-6 pt-4 text-center text-xs text-gray-400 border-t border-gray-200">
        <p>© 2024 WHS Solution Recruitment Suite. All rights reserved.</p>
        <div className="flex justify-center gap-4 mt-1">
          <a href="#" className="hover:text-gray-600 transition">Privacy Policy</a>
          <a href="#" className="hover:text-gray-600 transition">Help Center</a>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;