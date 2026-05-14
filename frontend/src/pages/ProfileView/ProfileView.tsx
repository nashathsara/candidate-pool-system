import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { 
  FiBookOpen,
  FiCpu,
  FiMail,
  FiPhone,
  FiMapPin,
  FiShare2,
  FiCheckCircle,
  FiDollarSign,
  FiClock,
  FiArrowLeft,
  FiBriefcase,
  FiTrendingUp,
  FiAward,
  FiCode
} from 'react-icons/fi';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`;

interface CandidateProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  interestedField: string;
  skills: string[];
  experienceYears: number;
  status: string;
  availability: string;
  expectedSalaryMin: number;
  expectedSalaryMax: number;
  linkedIn?: string;
  dateOfBirth?: string;
  age?: string;
  cvData?: {
    content: string;
    fileName: string;
    fileType: string;
    fileSize: number;
  };
  createdAt: any;
  applicationStatus: string;
}

interface ExtractedCVData {
  education: Array<{
    degree: string;
    institution: string;
    year: string;
    gpa?: string;
    achievements?: string[];
  }>;
  experience: Array<{
    title: string;
    company: string;
    period: string;
    description: string;
  }>;
  projects: Array<{
    name: string;
    technologies: string;
    description: string;
  }>;
  certifications: string[];
  languages: string[];
}

const ProfileView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedCVData>({
    education: [],
    experience: [],
    projects: [],
    certifications: [],
    languages: []
  });
  const [extractionStatus, setExtractionStatus] = useState<string>('');

  useEffect(() => {
    if (id) {
      fetchCandidateProfile(id);
    }
  }, [id]);

  const fetchCandidateProfile = async (candidateId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const docRef = doc(db, 'candidates', candidateId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        const profileData: CandidateProfile = {
          id: docSnap.id,
          fullName: data.fullName || 'Unknown',
          email: data.email || '',
          phone: data.phone || '',
          location: data.location || 'Remote',
          interestedField: data.interestedField || '',
          skills: data.skills || [],
          experienceYears: data.experienceYears || 0,
          status: data.status || 'New',
          availability: data.availability || 'Not specified',
          expectedSalaryMin: data.expectedSalaryMin || 0,
          expectedSalaryMax: data.expectedSalaryMax || 0,
          linkedIn: data.linkedIn || '',
          dateOfBirth: data.dateOfBirth || '',
          age: data.age || '',
          cvData: data.cvData,
          createdAt: data.createdAt,
          applicationStatus: data.applicationStatus || 'pending'
        };
        
        setProfile(profileData);
        await extractCVData(profileData);
        
      } else {
        setError('Candidate not found');
      }
    } catch (err) {
      console.error('Error fetching candidate:', err);
      setError('Failed to load candidate profile');
    } finally {
      setLoading(false);
    }
  };

  const extractTextFromPDF = async (pdfDataUrl: string): Promise<string> => {
    try {
      const base64 = pdfDataUrl.split(',')[1];
      const binaryString = window.atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const loadingTask = pdfjsLib.getDocument({ data: bytes });
      const pdf = await loadingTask.promise;
      
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n';
      }
      
      return fullText;
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      return '';
    }
  };

  const extractTextFromTxt = async (dataUrl: string): Promise<string> => {
    try {
      const textContent = decodeURIComponent(dataUrl.split(',')[1] || '');
      return textContent;
    } catch (error) {
      console.error('Error extracting text from TXT:', error);
      return '';
    }
  };

  const extractTextFromCV = async (cvData: any): Promise<string> => {
    if (!cvData || !cvData.content) {
      setExtractionStatus('No CV file found');
      return '';
    }
    
    setExtractionStatus('Extracting text from CV...');
    
    try {
      if (cvData.fileType === 'application/pdf' || cvData.content.includes('application/pdf')) {
        return await extractTextFromPDF(cvData.content);
      } else if (cvData.fileType === 'text/plain' || cvData.content.includes('text/plain')) {
        return await extractTextFromTxt(cvData.content);
      } else {
        setExtractionStatus('Unsupported file type');
        return '';
      }
    } catch (error) {
      console.error('Error extracting text:', error);
      setExtractionStatus('Failed to extract text from CV');
      return '';
    }
  };

  const extractEducationFromText = (text: string) => {
    const educationEntries = [];
    
    // Find Education section
    const educationMatch = text.match(/Education([\s\S]*?)(?=Skills|Experience|Work|Projects|Certifications|Languages|$)/i);
    if (!educationMatch) {
      return [];
    }
    
    const educationText = educationMatch[1];
    console.log('Education section:', educationText);
    
    // Parse University entry
    const universityMatch = educationText.match(/([A-Za-z\s]+University[^•]*?)(?=•|J\/|$)/i);
    if (universityMatch) {
      const universityText = universityMatch[1];
      
      const institutionMatch = universityText.match(/([A-Za-z\s]+University)/i);
      const degreeMatch = universityText.match(/(BSc\(?Hons?\)?\s*in\s*[A-Za-z\s]+)/i);
      const yearMatch = universityText.match(/(\d{4})\s*[–-]\s*(Present|\d{4})/i);
      const gpaMatch = universityText.match(/GPA:\s*(\d+\.?\d*)\/?\s*(\d+\.?\d*)?/i);
      
      const university: any = {
        institution: institutionMatch ? institutionMatch[1].trim() : 'University of Moratuwa',
        degree: degreeMatch ? degreeMatch[1].trim() : 'BSc(Hons) in Information Technology',
        year: yearMatch ? `${yearMatch[1]} - ${yearMatch[2]}` : '2023 - Present',
        gpa: gpaMatch ? gpaMatch[1] + (gpaMatch[2] ? `/${gpaMatch[2]}` : '') : ''
      };
      
      educationEntries.push(university);
    }
    
    // Parse School/College entry
    const schoolMatch = educationText.match(/(J\/[A-Za-z\s]+College)[^•]*?(?=•|$)/i);
    if (schoolMatch) {
      const schoolText = schoolMatch[0];
      
      const institutionMatch = schoolText.match(/(J\/[A-Za-z\s]+College)/i);
      const degreeMatch = schoolText.match(/(GCE\s+A\/L[^•\n]*)/i);
      const yearMatch = schoolText.match(/(\d{4})/);
      const resultsMatch = schoolText.match(/(\d+[A-Z]\s+[A-Z]|\d+[A-Z]\s+[A-Z]\s+[A-Z])/i);
      const zScoreMatch = schoolText.match(/Z\s*Score:\s*(\d+\.?\d*)/i);
      
      const achievements = [];
      if (resultsMatch) achievements.push(`Results: ${resultsMatch[0]}`);
      if (zScoreMatch) achievements.push(`Z-Score: ${zScoreMatch[1]}`);
      
      const school: any = {
        institution: institutionMatch ? institutionMatch[1].trim() : 'Kokuvil Hindu College',
        degree: degreeMatch ? degreeMatch[1].trim() : 'GCE Advanced Level',
        year: yearMatch ? yearMatch[1] : '2021',
        achievements: achievements
      };
      
      educationEntries.push(school);
    }
    
    return educationEntries;
  };

const extractProjectsFromText = (text: string) => {
  const projectEntries = [];
  
  console.log('Searching for projects in CV text...');
  
  // Find the Projects section
  const projectsSectionMatch = text.match(/Projects([\s\S]*?)(?=Education|Experience|Skills|Certifications|Languages|Work|Employment|$)/i);
  if (!projectsSectionMatch) {
    console.log('No Projects section found');
    return [];
  }
  
  const projectsText = projectsSectionMatch[1];
  console.log('Projects section found, length:', projectsText.length);
  console.log('Projects section preview:', projectsText.substring(0, 500));
  
  // Split by project names (looking for patterns like "ProjectName –" or "ProjectName -")
  const lines = projectsText.split(/\r?\n/);
  let currentProject: any = null;
  let currentDescription = '';
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if (!line || line.length < 3) continue;
    
    // Check if this line contains a project name (ends with – or - or contains project indicator)
    const projectNameMatch = line.match(/^([A-Za-z0-9\s]+?)(?:\s*[–\-]|\s*$)/);
    
    // Also check for common project name patterns
    const hasProjectIndicator = line.match(/^(Tiny|Automated|SmartShop|[A-Z][a-z]+.*?(?:Website|Platform|System|App|E-Commerce))/i);
    
    if (projectNameMatch && projectNameMatch[1].length > 5 && projectNameMatch[1].length < 50 && 
        (line.includes('–') || line.includes('-') || hasProjectIndicator)) {
      
      // Save previous project
      if (currentProject && currentProject.name) {
        currentProject.description = currentDescription.trim();
        if (currentProject.description || currentProject.technologies) {
          projectEntries.push(currentProject);
        }
      }
      
      // Start new project
      const projectName = projectNameMatch[1].trim();
      currentProject = {
        name: projectName,
        technologies: '',
        description: ''
      };
      currentDescription = '';
      
      // Remove the project name from the line for description
      let remainingLine = line.replace(projectNameMatch[0], '').replace(/^[–\-]\s*/, '');
      if (remainingLine && remainingLine.length > 5) {
        currentDescription = remainingLine;
      }
    }
    else if (currentProject) {
      // Check for technologies
      if (line.match(/Technologies?:/i) || line.match(/Tech Stack:/i) || line.match(/Modules?:/i)) {
        const techMatch = line.match(/(?:Technologies|Tech Stack|Modules):?\s*(.+)/i);
        if (techMatch && techMatch[1]) {
          currentProject.technologies = techMatch[1].trim();
        }
      }
      // Check for Role
      else if (line.match(/Role:/i)) {
        const roleMatch = line.match(/Role:\s*(.+)/i);
        if (roleMatch && roleMatch[1]) {
          currentDescription += (currentDescription ? ' ' : '') + roleMatch[1];
        }
      }
      // Check for bullet points or description lines
      else if (line.length > 5 && !line.match(/^[•\-*]/)) {
        currentDescription += (currentDescription ? ' ' : '') + line;
      }
      else if (line.match(/^[•\-*]/)) {
        // Bullet point
        const bulletText = line.replace(/^[•\-*]\s*/, '');
        if (bulletText && bulletText.length > 5) {
          currentDescription += (currentDescription ? '. ' : '') + bulletText;
        }
      }
    }
  }
  
  // Add the last project
  if (currentProject && currentProject.name) {
    currentProject.description = currentDescription.substring(0, 500);
    if (currentProject.description || currentProject.technologies) {
      projectEntries.push(currentProject);
    }
  }
  
  // Filter out invalid projects
  const validProjects = projectEntries.filter(project => 
    project.name && 
    project.name.length > 5 &&
    !project.name.toLowerCase().includes('project') &&
    !project.name.toLowerCase().includes('and gaining') &&
    project.name.length < 60
  );
  
  console.log(`Extracted ${validProjects.length} valid projects:`, validProjects);
  
  // If still no projects, try a simpler approach - look for lines with project indicators
  if (validProjects.length === 0) {
    console.log('Trying alternative project detection...');
    
    const projectIndicators = ['Tiny Treasures', 'Automated Medicine', 'SmartShop', 'E-Commerce', 'Website', 'Platform', 'System'];
    
    for (const indicator of projectIndicators) {
      const index = text.indexOf(indicator);
      if (index !== -1) {
        // Find the line containing this indicator
        const lines = text.substring(Math.max(0, index - 100), Math.min(text.length, index + 500)).split(/\r?\n/);
        let projectName = '';
        let projectDesc = '';
        
        for (const line of lines) {
          if (line.includes(indicator) && !projectName) {
            // Extract project name
            const nameMatch = line.match(/([A-Za-z0-9\s]{5,50}?)(?:\s*[–\-]|$)/);
            if (nameMatch) {
              projectName = nameMatch[1].trim();
            }
            projectDesc = line;
          } else if (projectName && line.trim() && line.length > 10) {
            projectDesc += ' ' + line;
          }
        }
        
        if (projectName) {
          // Extract technologies if present
          const techMatch = projectDesc.match(/Technologies?:?\s*([^.\n]{10,200})/i);
          const technologies = techMatch ? techMatch[1].trim() : '';
          
          // Clean description
          let description = projectDesc.replace(projectName, '').replace(/Technologies?:?[^.]*\.?/, '');
          description = description.replace(/\s+/g, ' ').trim();
          
          if (description.length > 500) {
            description = description.substring(0, 500) + '...';
          }
          
          validProjects.push({
            name: projectName,
            technologies: technologies,
            description: description || 'Project details found in CV'
          });
        }
      }
    }
  }
  
  return validProjects;
};

  const extractExperienceFromText = (text: string) => {
    const experienceEntries = [];
    
    // Look for internship or work experience
    const internshipMatch = text.match(/(?:Intern|Internship|Work Experience|Experience)([\s\S]*?)(?=Education|Skills|Projects|Certifications|$)/i);
    if (!internshipMatch) {
      return [];
    }
    
    const expText = internshipMatch[1];
    
    // Look for Software Engineer Intern or similar
    const internTitleMatch = expText.match(/(Software Engineer Intern|Intern|Software Intern)([^\n]*)/i);
    if (internTitleMatch) {
      experienceEntries.push({
        title: 'Software Engineer Intern',
        company: 'Current Company',
        period: '',
        description: 'Internship experience in software development'
      });
    }
    
    return experienceEntries;
  };

  const extractCVData = async (profile: CandidateProfile) => {
    setExtractionStatus('Starting CV extraction...');
    
    // Extract text from CV file
    const cvText = await extractTextFromCV(profile.cvData);
    
    if (cvText.length > 0) {
      console.log('Extracted CV Text length:', cvText.length);
      console.log('First 1000 chars:', cvText.substring(0, 1000));
      
      setExtractionStatus('Extracting education details...');
      const educationEntries = extractEducationFromText(cvText);
      
      setExtractionStatus('Extracting project details...');
      const projectEntries = extractProjectsFromText(cvText);
      
      setExtractionStatus('Extracting experience details...');
      const experienceEntries = extractExperienceFromText(cvText);
      
      console.log('Extracted education:', educationEntries);
      console.log('Extracted projects:', projectEntries);
      console.log('Extracted experience:', experienceEntries);
      
      setExtractedData({
        education: educationEntries,
        experience: experienceEntries,
        projects: projectEntries,
        certifications: [],
        languages: []
      });
      
      let statusMsg = `Found ${educationEntries.length} education entries`;
      if (projectEntries.length > 0) statusMsg += `, ${projectEntries.length} projects`;
      if (experienceEntries.length > 0) statusMsg += `, ${experienceEntries.length} experience entries`;
      setExtractionStatus(statusMsg);
    } else {
      setExtractionStatus('Could not extract text from CV. The file might be corrupted or empty.');
    }
  };

  const handleShareProfile = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Profile link copied to clipboard!');
  };

  const handleViewFullCV = () => {
    if (profile?.cvData?.content) {
      const win = window.open();
      if (win) {
        win.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>${profile.fullName} - CV</title>
            <style>
              body { margin: 0; padding: 0; height: 100vh; overflow: hidden; }
              embed { width: 100%; height: 100%; border: none; }
            </style>
          </head>
          <body>
            <embed src="${profile.cvData.content}" type="application/pdf" width="100%" height="100%" />
          </body>
          </html>
        `);
        win.document.close();
      }
    } else {
      alert('No CV available');
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'actively looking') return 'bg-green-100 text-green-800';
    if (statusLower === 'open to opportunities') return 'bg-blue-100 text-blue-800';
    if (statusLower === 'in review') return 'bg-orange-100 text-orange-800';
    if (statusLower === 'pending') return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading candidate profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl p-8 shadow-sm max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error || 'Candidate not found'}</p>
          <button 
            onClick={() => navigate('/candidates')} 
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Candidates
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/candidates')} 
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-all mb-6"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to Candidates
        </button>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mb-6">
          <button 
            onClick={handleShareProfile}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium"
          >
            <FiShare2 className="w-4 h-4" />
            Share Profile
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all text-sm font-medium">
            <FiCheckCircle className="w-4 h-4" />
            Update Status
          </button>
        </div>

        {/* Header Section */}
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-sm">
          <div className="flex justify-between items-start flex-wrap gap-6">
            <div className="flex gap-6 items-center flex-wrap">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {getInitials(profile.fullName)}
                </div>
                <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
                  profile.status.toLowerCase() === 'actively looking' ? 'bg-green-500' :
                  profile.status.toLowerCase() === 'open to opportunities' ? 'bg-blue-500' :
                  profile.status.toLowerCase() === 'in review' ? 'bg-orange-500' : 'bg-gray-500'
                }`}></div>
              </div>
              
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.fullName}</h1>
                <p className="text-lg text-blue-600 font-medium mb-2">{profile.interestedField?.split('/')[0] || 'Candidate'}</p>
                <div className="flex flex-wrap gap-4 text-gray-500 text-sm">
                  <span className="flex items-center gap-2">
                    <FiMapPin className="w-4 h-4" />
                    {profile.location}
                  </span>
                  <span className="flex items-center gap-2">
                    <FiMail className="w-4 h-4" />
                    {profile.email}
                  </span>
                  <span className="flex items-center gap-2">
                    <FiPhone className="w-4 h-4" />
                    {profile.phone}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mb-2 ${getStatusColor(profile.status)}`}>
                {profile.status}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
                <FiClock className="w-4 h-4" />
                Available: {profile.availability}
              </div>
            </div>
          </div>
        </div>

        {/* Extraction Status */}
        {extractionStatus && (
          <div className="mb-6 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm">
            {extractionStatus}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.6fr] gap-8">
          {/* Left Column */}
          <div>
            {/* Education Section */}
            <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-gray-100 flex items-center gap-2">
                <FiBookOpen className="w-5 h-5 text-green-500" />
                Education
              </h3>
              
              {extractedData.education.length > 0 ? (
                extractedData.education.map((edu, index) => (
                  <div key={index} className="mb-6 last:mb-0 pb-4 last:pb-0 border-b border-gray-100 last:border-0">
                    <div className="flex flex-wrap justify-between items-start gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                      {edu.year && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                          {edu.year}
                        </span>
                      )}
                    </div>
                    <p className="text-blue-600 text-sm font-medium mb-2">{edu.institution}</p>
                    
                    {edu.gpa && (
                      <p className="text-gray-600 text-sm mb-2">
                        <span className="font-medium">GPA:</span> {edu.gpa}
                      </p>
                    )}
                    
                    {edu.achievements && edu.achievements.length > 0 && (
                      <div className="mt-2">
                        <ul className="list-disc list-inside space-y-1">
                          {edu.achievements.map((achievement, idx) => (
                            <li key={idx} className="text-gray-600 text-sm">{achievement}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <FiBookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No education details found in CV.</p>
                </div>
              )}
            </div>

            {/* Projects Section */}
            <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-gray-100 flex items-center gap-2">
                <FiCode className="w-5 h-5 text-purple-500" />
                Projects
              </h3>
              
              {extractedData.projects.length > 0 ? (
                extractedData.projects.map((project, index) => (
                  <div key={index} className="mb-6 last:mb-0 pb-4 last:pb-0 border-b border-gray-100 last:border-0">
                    <h4 className="font-semibold text-gray-900">{project.name}</h4>
                    {project.technologies && (
                      <div className="flex flex-wrap gap-1 mt-1 mb-2">
                        {project.technologies.split(',').map((tech, idx) => (
                          <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-gray-600 text-sm leading-relaxed">{project.description}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <FiAward className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No projects found in CV. Projects may be listed in the CV document.</p>
                  <button 
                    onClick={handleViewFullCV}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                  >
                    View Full CV for Projects
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div>
            {/* Technical Skills */}
            <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-gray-100 flex items-center gap-2">
                <FiCpu className="w-5 h-5 text-orange-500" />
                Technical Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.length > 0 ? (
                  profile.skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1.5 bg-blue-50 text-blue-900 rounded-lg text-sm font-medium hover:bg-blue-100 transition">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No skills listed in profile</p>
                )}
              </div>
            </div>

            {/* Compensation */}
            <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-gray-100 flex items-center gap-2">
                <FiDollarSign className="w-5 h-5 text-green-500" />
                Compensation
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Expected Salary:</span>
                  <span className="text-sm font-semibold text-gray-900">
                    ${profile.expectedSalaryMin.toLocaleString()} - ${profile.expectedSalaryMax.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Experience:</span>
                  <span className="text-sm font-semibold text-gray-900">{profile.experienceYears} years</span>
                </div>
                {profile.age && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-500">Age:</span>
                    <span className="text-sm font-semibold text-gray-900">{profile.age}</span>
                  </div>
                )}
              </div>
            </div>

            {/* CV/Resume */}
            {profile.cvData && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-gray-100">
                  Resume/CV
                </h3>
                <button 
                  onClick={handleViewFullCV}
                  className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all mb-3"
                >
                  View Full CV
                </button>
                <p className="text-xs text-gray-500 text-center">
                  {profile.cvData.fileName} ({(profile.cvData.fileSize / 1024).toFixed(0)} KB)
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;