import React, { useEffect, useRef, useState } from "react";
import { FiShield, FiMail, FiLock, FiArrowLeft } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const EmailVerification: React.FC = () => {
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState<number>(120);
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Get email from location state or localStorage
  useEffect(() => {
    const userEmail = location.state?.email || localStorage.getItem('pendingVerificationEmail');
    if (userEmail) {
      setEmail(userEmail);
      setIsLoading(false);
    } else {
      // If no email, redirect to signup
      navigate('/signup');
    }
  }, [location, navigate]);

  useEffect(() => {
    if (timer <= 0) return;
    if (!isResendDisabled) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setIsResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isResendDisabled, timer]);

  const handleCodeChange = (index: number, value: string) => {
    if (value && !/^\d+$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);

    if (/^\d+$/.test(pastedData)) {
      const digits = pastedData.split("");
      const newCode = [...code];

      for (let i = 0; i < digits.length; i++) {
        if (i < 6) newCode[i] = digits[i];
      }

      setCode(newCode);
      const lastFilledIndex = Math.min(digits.length - 1, 5);
      inputRefs.current[lastFilledIndex]?.focus();
    }
  };

  const handleVerify = async () => {
    const enteredCode = code.join("");
    if (enteredCode.length !== 6) {
      setError("Please enter the full 6-digit code");
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      // Send verification code to backend
      const response = await axios.post('http://localhost:5000/api/candidates/verify-email', {
        email: email,
        verificationCode: enteredCode
      });

      if (response.data.status === 'success') {
        // Mark email as verified in localStorage
        localStorage.setItem('emailVerified', 'true');
        localStorage.removeItem('pendingVerificationEmail');
        
        // Navigate to success page
        navigate('/verified', { 
          state: { message: "Email verified successfully!" }
        });
      } else {
        setError(response.data.message || "Invalid verification code. Please try again.");
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      setError(error.response?.data?.message || "Verification failed. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    setIsResendDisabled(true);
    setTimer(30);
    setError("");
    
    try {
      // Request new verification code from backend
      const response = await axios.post('http://localhost:5000/api/candidates/resend-verification', {
        email: email
      });
      
      if (response.data.status === 'success') {
        // Show success message
        alert("New verification code sent to your email!");
      } else {
        setError(response.data.message || "Failed to resend code");
        setIsResendDisabled(false);
        setTimer(0);
      }
    } catch (error: any) {
      console.error("Resend error:", error);
      setError(error.response?.data?.message || "Failed to resend verification code");
      setIsResendDisabled(false);
      setTimer(0);
    }
  };

  const setInputRef = (index: number) => (el: HTMLInputElement | null) => {
    inputRefs.current[index] = el;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        {/* Back button */}
        <button
          onClick={() => navigate('/signup')}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Sign Up</span>
        </button>

        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center">
              <FiMail className="w-10 h-10 text-indigo-600" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify your email</h2>
          <p className="text-gray-600 mb-2">
            We sent a verification code to
          </p>
          <p className="font-semibold text-indigo-600 mb-6">
            {email}
          </p>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-center gap-2">
              <FiShield className="w-5 h-5 text-indigo-600" />
              <span className="text-indigo-700 font-medium text-sm">
                Enter the 6-digit verification code
              </span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="mb-6">
            <div
              className="flex justify-center gap-3"
              onPaste={handlePaste}
              role="group"
              aria-label="Verification code inputs"
            >
              {code.map((digit, i) => (
                <input
                  key={i}
                  ref={setInputRef(i)}
                  value={digit}
                  onChange={(e) => handleCodeChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  inputMode="numeric"
                  maxLength={1}
                  className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                  autoFocus={i === 0}
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleVerify}
            disabled={isVerifying}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isVerifying ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Verifying...
              </>
            ) : (
              "Verify Email"
            )}
          </button>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Didn't receive the code?{" "}
              <button
                onClick={handleResendCode}
                disabled={isResendDisabled}
                className="font-semibold text-indigo-600 hover:text-indigo-700 transition disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                Resend code {isResendDisabled && `(${timer}s)`}
              </button>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <FiLock className="w-4 h-4" />
              <span>Secure verification process</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;