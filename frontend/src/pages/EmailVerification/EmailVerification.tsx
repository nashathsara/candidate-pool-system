import React, { useState, useEffect } from 'react';
import { FiMail, FiRefreshCw } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../config/firebase';
import { sendEmailVerification, onAuthStateChanged, type User } from 'firebase/auth';

const EmailVerification: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const message = 'Waiting for you to click the link...';
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Auth Status 
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        console.log("User detected:", user.email);
      }
    });

    // 2. Automatic Check: 3 seconds
    const checkInterval = setInterval(async () => {
      if (auth.currentUser) {
        await auth.currentUser.reload();
        if (auth.currentUser.emailVerified) {
          clearInterval(checkInterval);
          navigate('/verified');
        }
      }
    }, 3000); 

    return () => {
      unsubscribe();
      clearInterval(checkInterval);
    };
  }, [navigate]);

  const handleResend = async () => {
    if (currentUser) {
      try {
        await sendEmailVerification(currentUser);
        alert("Verification link resent to your email!");
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-[32px] shadow-2xl max-w-md w-full p-10 text-center border border-slate-100">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center">
            <FiMail className="w-10 h-10 text-indigo-600 animate-bounce" />
          </div>
        </div>

        <h2 className="text-2xl font-black text-slate-900 mb-2">Verify your email</h2>
        <p className="text-slate-500 mb-6">
          We sent a link to <span className="font-bold text-slate-800">{currentUser?.email || "checking inbox..."}</span>
        </p>

        {/* Status Indicator */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 mb-8 flex items-center justify-center gap-3">
          <FiRefreshCw className="animate-spin text-indigo-600" />
          <span className="text-indigo-700 font-medium text-sm">{message}</span>
        </div>

        <div className="space-y-4 text-sm text-slate-500">
          <p>Once you click the link in your email, this page will <b>automatically</b> update.</p>
          
          <button 
            onClick={handleResend}
            className="text-indigo-600 font-bold hover:underline"
          >
            Didn't get the email? Resend link
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;