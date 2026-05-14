import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate,Link } from 'react-router-dom'; // පේජ් එක මාරු කිරීමට අවශ්‍යයි
import Button from '../../common/Button/Button';

const Signup: React.FC = () => {
  const navigate = useNavigate(); // Navigation initialize කිරීම
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  const colors = {
    brandNavy: "#102A38",
    blueTeal: "#2CCB7C",
    formBg: "#FBFBFB", // Light off-white for the right panel
    inputAsh: "#F1F5F9", // The "ash" background for input fields
    inputBorder: "#E2E8F0",
    textGray: "#718096"
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Backend එකට දත්ත යැවීම
      const response = await axios.post('http://localhost:5000/api/candidates/register', {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password
      });

      if (response.data.status === 'success') {
        // ඊමේල් එක ගිය බව දන්වා වෙරිෆිකේෂන් පේජ් එකට යැවීම
        alert("Verification link sent to your email!");
        navigate('/email-verification'); 
      } else if (response.data.status === 'duplicate') {
        alert("This profile already exists in the system.");
      }
    } catch (error: any) {
      console.error("Signup Error:", error);
      const errorMessage = error.response?.data?.message || "Something went wrong. Please check your backend connection.";
      alert(errorMessage);
    }
  };

  return (
    <div className="flex min-h-screen w-full font-sans">
      {/* LEFT PANEL: Brand Section */}
      <div 
        className="hidden lg:flex w-1/2 flex-col justify-center px-16 text-white py-12"
        style={{ backgroundColor: colors.brandNavy }}
      >
        <h1 className="text-5xl font-bold leading-tight mb-6">
          Empowering Your <br />
          <span style={{ color: colors.blueTeal }}>Next Career Move</span>
        </h1>
        <p className="text-blue-100 text-sm mt-4 leading-relaxed font-medium opacity-90" >
          Join thousands of professionals finding their dream roles through TalentMatch’s precision matching system.
        </p>
        
        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-6 mt-12">
          {/* Card 1 */}
          <div className="bg-white/10 p-6 rounded-xl border border-white/20">
            <div 
              className="w-10 h-10 mb-4 rounded-lg flex items-center justify-center text-black shadow-lg"
              style={{ backgroundColor: colors.blueTeal }}
            >
              ⚡
            </div>
            <h3 className="font-bold text-lg mb-1">Fast Tracking</h3>
            <p className="text-sm font-medium opacity-95 text-white">Get noticed by top recruiters instantly.</p>
          </div>
          {/* Card 2 */}
          <div className="bg-white/10 p-6 rounded-xl border border-white/20">
            <div 
              className="w-10 h-10 mb-4 rounded-lg flex items-center justify-center text-black shadow-lg"
              style={{ backgroundColor: colors.blueTeal }}
            >
              ✔
            </div>
            <h3 className="font-bold text-lg mb-1">Verified Jobs</h3>
            <p className="text-sm font-medium opacity-95 text-white">High-quality roles vetted by experts.</p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Form Section */}
      <div 
        className="w-full lg:w-1/2 flex flex-col items-center px-10 pt-8 pb-12"
        style={{ backgroundColor: colors.formBg }}
      >
        <div className="w-full flex justify-between items-center mb-20 text-sm">
          <div className="font-bold text-lg text-slate-900">CandidateHub</div>
          <div className="text-gray-500 font-semibold hover:text-black cursor-pointer transition-colors">Help Center</div>
        </div>

        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h2>
            <p style={{ color: colors.textGray }}>Start your journey toward a more impactful career.</p>
          </div>
          
          <div className="flex gap-4 mb-8">
            <button type="button" className="flex-1 py-3 border border-slate-200 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 transition-all font-semibold text-slate-700">
              <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="Google" className="w-5 h-5" /> Google
            </button>
            <button type="button" className="flex-1 py-3 border border-slate-200 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 transition-all font-semibold text-slate-700">
              <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" className="w-5 h-5" /> LinkedIn
            </button>
          </div>

          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase tracking-wider font-bold">Or continue with email</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-bold mb-1.5 text-gray-700">Full Name</label>
              <input 
                name="fullName"
                type="text" 
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe" 
                className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-800" 
                style={{ backgroundColor: colors.inputAsh, borderColor: colors.inputBorder }} 
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1.5 text-gray-700">Email Address</label>
              <input 
                name="email"
                type="email" 
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="john.doe@example.com" 
                className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-800" 
                style={{ backgroundColor: colors.inputAsh, borderColor: colors.inputBorder }} 
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1.5 text-gray-700">Password</label>
              <input 
                name="password"
                type="password" 
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••" 
                className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-800" 
                style={{ backgroundColor: colors.inputAsh, borderColor: colors.inputBorder }} 
              />
              <p className="text-xs font-medium text-gray-500 mt-2">Must be at least 8 characters.</p>
            </div>
            
            <div className="flex items-start gap-3 py-1">
              <input type="checkbox" required className="mt-1 accent-black" id="terms" />
              <label htmlFor="terms" className="text-sm text-gray-500 leading-tight">
                I agree to the <span className="text-black underline font-bold cursor-pointer">Terms of Service</span> and <span className="text-black underline font-bold cursor-pointer">Privacy Policy</span>.
              </label>
            </div>

            <Button label="Create Account →" type="submit" />
          </form>
          
          <p className="text-center mt-8 text-sm text-gray-600">
            Already have an account? <Link to="/signin" className="text-black font-bold hover:underline">Sign in</Link>
          </p>
          <div className="text-center mt-4">
            <Link to="/" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;