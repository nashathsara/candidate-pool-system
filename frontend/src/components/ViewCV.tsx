// src/components/ViewCV.tsx
import React, { useState } from 'react';
import { db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { FiDownload,  FiAlertCircle } from 'react-icons/fi';

interface ViewCVProps {
  candidateId: string;
  buttonText?: string;
  className?: string;
}

const ViewCV: React.FC<ViewCVProps> = ({ 
  candidateId, 
  buttonText = "Download CV", 
  className = "bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" 
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadCV = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get candidate document from Firestore
      const docRef = doc(db, 'candidates', candidateId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        const cvData = data.cvData;
        
        if (cvData && cvData.content) {
          // Create a download link
          const link = document.createElement('a');
          link.href = cvData.content;
          link.download = cvData.fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Show success message (optional)
          console.log('Download started:', cvData.fileName);
        } else {
          setError('No CV found for this candidate');
        }
      } else {
        setError('Candidate not found');
      }
    } catch (error) {
      console.error('Error downloading CV:', error);
      setError('Error downloading CV. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
          <FiAlertCircle />
          <span>{error}</span>
        </div>
      )}
      <button
        onClick={downloadCV}
        disabled={loading}
        className={className}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin">⏳</span>
            Loading...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <FiDownload />
            {buttonText}
          </span>
        )}
      </button>
    </div>
  );
};

export default ViewCV;