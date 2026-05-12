import React, { useEffect, useRef, useState } from "react";
import { FiShield, FiMail, FiLock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import { auth } from "../../config/firebase";

const EmailVerification: React.FC = () => {
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState<number>(30);
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

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

  useEffect(() => {
    // If already verified, skip
    if (auth.currentUser?.emailVerified) navigate("/verified");
  }, [navigate]);

  const handleCodeChange = (index: number, value: string) => {
    if (value && !/^\d+$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    setError("");

    if (value && index < 5) inputRefs.current[index + 1]?.focus();
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
      const lastFilledIndex = Math.min(digits.length, 5);
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
      // NOTE: This app previously used a mock code check.
      await new Promise<void>((resolve) => setTimeout(resolve, 1500));

      if (enteredCode === "123456") {
        navigate("/verified");
      } else {
        setError("Invalid verification code. Please try again.");
      }
    } catch {
      setError("Verification failed. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    setIsResendDisabled(true);
    setTimer(30);
    setError("");
    await new Promise<void>((resolve) => setTimeout(resolve, 500));
  };

  // Set ref callback
  const setInputRef = (index: number) => (el: HTMLInputElement | null) => {
    inputRefs.current[index] = el;
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
          We sent a link to{" "}
          <span className="font-bold text-slate-800">{auth.currentUser?.email || "checking inbox..."}</span>
        </p>

        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 mb-8 flex items-center justify-center gap-3">
          <FiShield className="w-5 h-5 text-indigo-600" />
          <span className="text-indigo-700 font-medium text-sm">Waiting for verification</span>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="mb-6">
          <div
            className="flex justify-center gap-2"
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
                className="w-12 h-12 text-center text-xl font-bold border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
              />
            ))}
          </div>
        </div>

        <button
          onClick={handleVerify}
          disabled={isVerifying}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
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
            <>
              Verify
              <FiShield className="w-5 h-5" />
            </>
          )}
        </button>

        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            Didn't receive the code?{" "}
            <button
              onClick={handleResendCode}
              disabled={isResendDisabled}
              className="font-medium text-indigo-600 hover:text-indigo-700 transition disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              Resend code {isResendDisabled && `(${timer}s)`}
            </button>
          </p>
        </div>

        <div className="mt-8 border-t border-gray-100" />

        <div className="mt-5">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <FiLock className="w-4 h-4" />
            <span>Secure Verification</span>
          </div>
        </div>
      </div>

      <div className="mt-6 max-w-md w-full pt-4 text-center text-xs text-gray-400 border-t border-gray-200">
        <p>© 2024 WHS Solution Recruitment Suite. All rights reserved.</p>
        <div className="flex justify-center gap-4 mt-1">
          <a href="#" className="hover:text-gray-600 transition">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-gray-600 transition">
            Help Center
          </a>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
