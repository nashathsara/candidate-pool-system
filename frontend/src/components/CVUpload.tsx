// src/components/CVUpload.tsx
import React, { useState } from 'react';
import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface CVUploadProps {
  onSuccess?: (candidate: any) => void;
}

const CVUpload: React.FC<CVUploadProps> = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    appliedRole: ''
  });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf' || 
          file.type === 'application/msword' || 
          file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        
        // Increase limit to 5MB for base64 (will be larger after encoding)
        if (file.size > 5 * 1024 * 1024) {
          setError('File too large. Please use a file smaller than 5MB.');
          setCvFile(null);
        } else {
          setCvFile(file);
          setError('');
        }
      } else {
        setError('Please upload a valid PDF or Word document');
        setCvFile(null);
      }
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate form
    if (!formData.fullName || !formData.email || !formData.appliedRole) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (!cvFile) {
      setError('Please upload a CV');
      setLoading(false);
      return;
    }

    try {
      // Convert CV to Base64
      console.log('Converting file to Base64...');
      const base64CV = await fileToBase64(cvFile);
      console.log('File converted, size:', base64CV.length);
      
      // Prepare candidate data with CV embedded
      const candidateData = {
        fullName: formData.fullName,
        email: formData.email.toLowerCase(),
        phone: formData.phone || '',
        appliedRole: formData.appliedRole,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        cvData: {
          fileName: cvFile.name,
          fileType: cvFile.type,
          fileSize: cvFile.size,
          content: base64CV, // Store CV content directly in Firestore
          uploadedAt: new Date().toISOString()
        },
        metadata: {
          source: 'manual_upload',
          uploadedAt: new Date().toISOString()
        }
      };

      // Add to Firestore
      console.log('Saving to Firestore...');
      const docRef = await addDoc(collection(db, 'candidates'), candidateData);
      console.log('Candidate saved with ID:', docRef.id);
      
      setSuccess(`Candidate ${formData.fullName} submitted successfully! CV stored in database.`);
      setFormData({ fullName: '', email: '', phone: '', appliedRole: '' });
      setCvFile(null);
      
      if (onSuccess) {
        onSuccess({ id: docRef.id, ...candidateData });
      }
      
      // Reset file input
      const fileInput = document.getElementById('cv-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (err: any) {
      console.error('Error submitting candidate:', err);
      console.error('Error details:', err.message, err.code);
      
      if (err.code === 'permission-denied') {
        setError('Firestore permission denied. Please check your Firestore security rules.');
      } else if (err.message.includes('exceeds')) {
        setError('File is too large. Please use a smaller file (under 1MB).');
      } else {
        setError(err.message || 'Failed to submit candidate. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Submit Candidate Application</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Applied Role *
            </label>
            <select
              name="appliedRole"
              value={formData.appliedRole}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={loading}
            >
              <option value="">Select a role</option>
              <option value="Frontend Developer">Frontend Developer</option>
              <option value="Backend Developer">Backend Developer</option>
              <option value="Full Stack Developer">Full Stack Developer</option>
              <option value="DevOps Engineer">DevOps Engineer</option>
              <option value="Data Scientist">Data Scientist</option>
              <option value="Product Manager">Product Manager</option>
              <option value="UI/UX Designer">UI/UX Designer</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload CV (PDF or Word) *
            </label>
            <input
              id="cv-file"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">Accepted formats: PDF, DOC, DOCX (Max 5MB)</p>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CVUpload;