import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiLayers, 
  FiSearch, 
  FiAlertCircle, 
  FiCheck, 
  FiRefreshCcw, 
  FiUser,
  FiCpu,
  FiShield,
} from 'react-icons/fi';
import { 
  collection, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
} from 'firebase/firestore';
import { db } from '../../config/firebase';

// Types
type CandidateData = {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  skills: string[];
  location?: string;
  experienceYears?: number;
  status?: string;
  interestedField?: string;
  availability?: string;
  createdAt?: any;
  addedDate?: string;
  dateOfBirth?: string;       
  age?: string;                
  linkedIn?: string;          
  source?: string;             
  expectedSalaryMin?: number;   
  expectedSalaryMax?: number;   
  applicationId?: string;       
  applicationStatus?: string;   
  contactMethods?: string[];    
  cvFileName?: string;          
};

type DuplicatePair = {
  id1: string;
  id2: string;
  candidate1: CandidateData;
  candidate2: CandidateData;
  score: number;
  matchReason: string;
  matchedFields: string[];
};

// Helper Components
const ProfileField: React.FC<{ label: string; value: string; isError?: boolean; isMuted?: boolean }> = 
({ label, value, isError, isMuted }) => (
  <div className="pb-4 border-b border-slate-50 flex flex-col">
    <span className="text-[10px] font-bold text-slate-400 uppercase mb-1">{label}</span>
    <span className={`text-sm font-medium ${
      isError ? 'text-rose-600' : isMuted ? 'text-slate-300 italic' : 'text-slate-700'
    }`}>
      {value || '—'} {isError && <FiAlertCircle className="inline ml-1 mb-0.5" />}
    </span>
  </div>
);

const SelectableOption: React.FC<{ 
  label: string; 
  value: string; 
  isSelected?: boolean;
  onClick?: () => void;
  isItalic?: boolean;
}> = ({ label, value, isSelected, onClick, isItalic }) => (
  <div 
    onClick={onClick}
    className={`p-4 rounded-xl border-2 flex justify-between items-center transition cursor-pointer ${
      isSelected ? 'border-slate-800 bg-slate-50' : 'border-slate-100 hover:border-slate-200'
    }`}
  >
    <div>
      <p className="text-[8px] font-black text-slate-400 mb-1">{label}</p>
      <p className={`text-sm font-bold ${isSelected ? 'text-slate-900' : 'text-slate-400'} ${isItalic ? 'italic' : ''}`}>
        {value}
      </p>
    </div>
    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
      isSelected ? 'border-slate-800 bg-slate-800' : 'border-slate-200'
    }`}>
      {isSelected && <FiCheck className="text-white w-3 h-3" />}
    </div>
  </div>
);

const TaskRow: React.FC<{ name: string; match: string; onClick?: () => void; isActive?: boolean }> = 
({ name, match, onClick, isActive }) => (
  <div 
    onClick={onClick}
    className={`p-4 flex items-center justify-between transition cursor-pointer group ${
      isActive ? 'bg-blue-50 hover:bg-blue-50' : 'hover:bg-slate-50'
    }`}
  >
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-slate-100 rounded text-[10px] font-bold flex items-center justify-center text-slate-500">
        {name.split(' ')[0]?.[0] || ''}
        {name.split(' vs. ')[1]?.[0] || ''}
      </div>
      <div>
        <p className="text-sm font-bold text-slate-700">{name}</p>
        <p className="text-[10px] text-slate-400 font-medium">
          Match Confidence: <span className="text-blue-500">{match}</span>
        </p>
      </div>
    </div>
    <span className="text-[10px] font-bold text-slate-400 group-hover:text-blue-600 flex items-center gap-1 transition">
      Review <FiRefreshCcw className="w-3 h-3" />
    </span>
  </div>
);

// AI-Powered Duplicate Detection Service
class AIDuplicateDetector {
  private static readonly GEMINI_API_KEY = "AIzaSyBsYQkY9cl7H4PJY8xvT8sVJ6aXkE4JbZk";
  private static readonly USE_GEMINI = true;
  private static cache: Map<string, number> = new Map();

  static async findDuplicates(candidates: CandidateData[]): Promise<DuplicatePair[]> {
    if (candidates.length < 2) return [];
    
    const pairs: DuplicatePair[] = [];
    const processedIds = new Set<string>();
    
    for (let i = 0; i < candidates.length; i++) {
      for (let j = i + 1; j < candidates.length; j++) {
        const a = candidates[i];
        const b = candidates[j];
        
        if (processedIds.has(a.id) || processedIds.has(b.id)) continue;
        
        const result = await this.comparePair(a, b);
        
        if (result.score >= 40) {
          pairs.push({
            id1: a.id,
            id2: b.id,
            candidate1: a,
            candidate2: b,
            score: result.score,
            matchReason: result.reason,
            matchedFields: result.matchedFields
          });
          
          if (result.score >= 75) {
            processedIds.add(a.id);
            processedIds.add(b.id);
          }
        }
      }
    }
    
    return pairs.sort((x, y) => y.score - x.score);
  }

  private static async comparePair(a: CandidateData, b: CandidateData): Promise<{ score: number; reason: string; matchedFields: string[] }> {
    const cacheKey = `${a.id}|${b.id}`;
    if (this.cache.has(cacheKey)) {
      const cachedScore = this.cache.get(cacheKey)!;
      return { score: cachedScore, reason: "Cached result", matchedFields: [] };
    }
    
    const ruleScore = this.calculatePriorityBasedScore(a, b);
    let finalScore = ruleScore.score;
    let matchedFields = ruleScore.matchedFields;
    
    if (this.USE_GEMINI && this.GEMINI_API_KEY && this.GEMINI_API_KEY !== "YOUR_GEMINI_API_KEY") {
      try {
        const aiScore = await this.getGeminiDuplicateScore(a, b);
        if (aiScore !== null) {
          finalScore = Math.round((ruleScore.score * 0.3) + (aiScore * 0.7));
        }
      } catch (error) {
        console.warn("Gemini API error, using rule-based score", error);
      }
    }
    
    const reason = this.generatePriorityReason(matchedFields, finalScore, a, b);
    this.cache.set(cacheKey, finalScore);
    
    return { score: finalScore, reason, matchedFields };
  }

  private static calculatePriorityBasedScore(a: CandidateData, b: CandidateData): { score: number; matchedFields: string[] } {
    let totalWeight = 0;
    let matchWeight = 0;
    const matchedFields: string[] = [];
    
    // CV Filename
    if (a.cvFileName && b.cvFileName) {
      const normalizeFileName = (fileName: string) => {
        return fileName.replace(/[\(\s\)]/g, '').replace(/\(\d+\)/g, '').toLowerCase().trim();
      };
      const normalizedA = normalizeFileName(a.cvFileName);
      const normalizedB = normalizeFileName(b.cvFileName);
      
      if (normalizedA === normalizedB) {
        matchWeight += 0.25;
        matchedFields.push('CV filename (same document)');
      } else if (this.similarity(normalizedA, normalizedB) > 0.8) {
        matchWeight += 0.15;
        matchedFields.push('CV filename (similar)');
      }
    }
    totalWeight += 0.25;
    
    // Email
    if (a.email && b.email) {
      if (a.email.toLowerCase() === b.email.toLowerCase()) {
        matchWeight += 0.20;
        matchedFields.push('email (exact match)');
      } else if (this.similarity(a.email, b.email) > 0.85) {
        matchWeight += 0.12;
        matchedFields.push('email (similar)');
      }
    }
    totalWeight += 0.20;
    
    // Phone
    if (a.phone && b.phone) {
      const phoneA = a.phone.replace(/\D/g, '');
      const phoneB = b.phone.replace(/\D/g, '');
      if (phoneA === phoneB && phoneA.length > 5) {
        matchWeight += 0.20;
        matchedFields.push('phone number (exact match)');
      }
    }
    totalWeight += 0.20;
    
    // LinkedIn
    if (a.linkedIn && b.linkedIn) {
      const normalizeUrl = (url: string) => url.toLowerCase().replace(/\/$/, '');
      if (normalizeUrl(a.linkedIn) === normalizeUrl(b.linkedIn)) {
        matchWeight += 0.15;
        matchedFields.push('LinkedIn profile');
      }
    }
    totalWeight += 0.15;
    
    // Date of Birth
    if (a.dateOfBirth && b.dateOfBirth) {
      if (a.dateOfBirth === b.dateOfBirth) {
        matchWeight += 0.12;
        matchedFields.push('date of birth');
      } else if (this.extractAge(a.dateOfBirth) === this.extractAge(b.dateOfBirth)) {
        matchWeight += 0.06;
        matchedFields.push('age');
      }
    }
    totalWeight += 0.12;
    
    // Name
    const nameSim = this.similarity(a.fullName || '', b.fullName || '');
    matchWeight += nameSim * 0.08;
    totalWeight += 0.08;
    if (nameSim > 0.7) matchedFields.push('name');
    
    // Skills
    const skillsSim = this.arraySimilarity(a.skills || [], b.skills || []);
    matchWeight += skillsSim * 0.06;
    totalWeight += 0.06;
    if (skillsSim > 0.6) matchedFields.push('skills');
    
    // Experience
    if (a.experienceYears !== undefined && b.experienceYears !== undefined) {
      const expDiff = Math.abs(a.experienceYears - b.experienceYears);
      if (expDiff <= 1) {
        matchWeight += 0.04;
        matchedFields.push('experience level');
      }
    }
    totalWeight += 0.04;
    
    // Interested field
    const fieldSim = this.similarity(a.interestedField || '', b.interestedField || '');
    matchWeight += fieldSim * 0.03;
    totalWeight += 0.03;
    if (fieldSim > 0.7) matchedFields.push('interested field');
    
    // Location
    const locSim = this.similarity(a.location || '', b.location || '');
    matchWeight += locSim * 0.02;
    totalWeight += 0.02;
    if (locSim > 0.7 && a.location && b.location) matchedFields.push('location');
    
    const score = totalWeight > 0 ? Math.round((matchWeight / totalWeight) * 100) : 0;
    return { score, matchedFields };
  }

  private static async getGeminiDuplicateScore(a: CandidateData, b: CandidateData): Promise<number | null> {
    const prompt = `You are a duplicate detection AI for a recruitment system. Analyze these two candidate profiles and rate their similarity from 0 to 100.

CRITICAL: Even if names are DIFFERENT, they could still be the SAME person if they share UNIQUE IDENTIFIERS.

HIGHEST PRIORITY (give these maximum weight):
- CV Filename (same filename = 100% same person, regardless of name)
- Email address (unique to person)
- Phone number (unique to person)  
- LinkedIn profile URL (unique to person)
- Date of birth (biometric identifier)

MEDIUM PRIORITY:
- Skills match
- Experience level
- Interested field

LOW PRIORITY:
- Name (names can be entered differently, have typos, or use nicknames)

Return ONLY a number between 0 and 100.

Candidate A:
- Full Name: ${a.fullName || 'N/A'}
- Email: ${a.email || 'N/A'}
- Phone: ${a.phone || 'N/A'}
- Date of Birth: ${a.dateOfBirth || 'N/A'}
- CV Filename: ${a.cvFileName || 'N/A'}
- LinkedIn: ${a.linkedIn || 'N/A'}
- Skills: ${(a.skills || []).join(', ') || 'N/A'}
- Experience: ${a.experienceYears ?? 'N/A'} years
- Interested Field: ${a.interestedField || 'N/A'}
- Location: ${a.location || 'N/A'}

Candidate B:
- Full Name: ${b.fullName || 'N/A'}
- Email: ${b.email || 'N/A'}
- Phone: ${b.phone || 'N/A'}
- Date of Birth: ${b.dateOfBirth || 'N/A'}
- CV Filename: ${b.cvFileName || 'N/A'}
- LinkedIn: ${b.linkedIn || 'N/A'}
- Skills: ${(b.skills || []).join(', ') || 'N/A'}
- Experience: ${b.experienceYears ?? 'N/A'} years
- Interested Field: ${b.interestedField || 'N/A'}
- Location: ${b.location || 'N/A'}

Duplicate score (0-100):`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${this.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 10, topP: 0.95 }
        })
      });
      
      const data = await response.json();
      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const score = parseInt(aiText.match(/\d+/)?.[0] || '');
      return !isNaN(score) ? Math.min(100, Math.max(0, score)) : null;
    } catch (error) {
      console.error("Gemini API error:", error);
      return null;
    }
  }

  private static generatePriorityReason(matchedFields: string[], score: number, a: CandidateData, b: CandidateData): string {
    if (matchedFields.includes('CV filename (same document)')) {
      return `🔴 CRITICAL: Same CV file uploaded (${a.cvFileName}) - These are the same person despite different names!`;
    }
    
    if (matchedFields.includes('email (exact match)')) {
      return `📧 Same email address (${a.email}) - These profiles belong to the same person`;
    }
    
    if (matchedFields.includes('phone number (exact match)')) {
      return `📱 Same phone number (${a.phone}) - These profiles belong to the same person`;
    }
    
    if (matchedFields.includes('LinkedIn profile')) {
      return `🔗 Same LinkedIn profile - These profiles belong to the same person`;
    }
    
    if (matchedFields.includes('date of birth')) {
      return `🎂 Same date of birth - Strong indicator these are the same person`;
    }
    
    if (score >= 85) {
      return `✅ High confidence duplicate: ${matchedFields.slice(0, 3).join(', ')} match`;
    }
    
    if (score >= 70) {
      return `⚠️ Likely duplicate: ${matchedFields.slice(0, 2).join(', ')} match detected`;
    }
    
    if (score >= 55) {
      return `🔍 Potential duplicate: Review ${matchedFields.slice(0, 2).join(', ')} for confirmation`;
    }
    
    if (score >= 40) {
      return `❓ Possible duplicate: ${matchedFields[0] || 'some fields'} match - manual review recommended`;
    }
    
    return "Low confidence match - likely different candidates";
  }

  private static extractAge(dateOfBirth?: string): number | null {
    if (!dateOfBirth) return null;
    try {
      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    } catch {
      return null;
    }
  }

  private static similarity(str1: string, str2: string): number {
    if (!str1 || !str2) return 0;
    const s1 = str1.toLowerCase().trim();
    const s2 = str2.toLowerCase().trim();
    if (s1 === s2) return 1;
    if (s1.includes(s2) || s2.includes(s1)) return 0.85;
    
    const words1 = s1.split(/[\s,.-]+/);
    const words2 = s2.split(/[\s,.-]+/);
    const intersection = words1.filter(w => words2.includes(w)).length;
    const union = new Set([...words1, ...words2]).size;
    return union === 0 ? 0 : intersection / union;
  }

  private static arraySimilarity(arr1: string[], arr2: string[]): number {
    if (!arr1.length || !arr2.length) return 0;
    const set2 = new Set(arr2.map(s => s.toLowerCase()));
    const matches = arr1.filter(s => set2.has(s.toLowerCase())).length;
    return matches / Math.max(arr1.length, arr2.length);
  }
}

// Main Component
const DuplicateResolution: React.FC = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<CandidateData[]>([]);
  const [duplicatePairs, setDuplicatePairs] = useState<DuplicatePair[]>([]);
  const [selectedPair, setSelectedPair] = useState<DuplicatePair | null>(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [mergedCount, setMergedCount] = useState(0);
  const [scanProgress, setScanProgress] = useState("");
  
  // Merge strategy state
  const [mergeStrategy, setMergeStrategy] = useState({
    keepName: 'candidate1',
    keepEmail: 'auto',
    keepPhone: 'auto',
    keepLocation: 'auto',
    keepSkills: 'combine',
    keepExperience: 'max',
    keepInterestedField: 'auto',
  });

  // Fetch all candidates from Firestore
  const fetchAllCandidates = async (): Promise<CandidateData[]> => {
    try {
      const candidatesRef = collection(db, "candidates");
      const q = query(candidatesRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const fetchedCandidates: CandidateData[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        fetchedCandidates.push({
          id: doc.id,
          fullName: data.fullName || data.name || "Unknown",
          email: data.email || "",
          phone: data.phone || "",
          skills: data.skills || [],
          location: data.location || "",
          experienceYears: data.experienceYears || 0,
          status: data.status || "New",
          interestedField: data.interestedField || "",
          availability: data.availability || "",
          createdAt: data.createdAt,
          addedDate: data.createdAt?.toDate?.().toLocaleDateString() || new Date().toLocaleDateString(),
          dateOfBirth: data.dateOfBirth || "",
          linkedIn: data.linkedIn || "",
          source: data.source || "",
          cvFileName: data.cvFileName || "",
          expectedSalaryMin: data.expectedSalaryMin,
          expectedSalaryMax: data.expectedSalaryMax,
          contactMethods: data.contactMethods || [],
        });
      });
      
      setCandidates(fetchedCandidates);
      return fetchedCandidates;
    } catch (error) {
      console.error("Error fetching candidates:", error);
      return [];
    }
  };

  // Run duplicate detection across all candidates
  const runDuplicateDetection = async () => {
    setScanning(true);
    setScanProgress("Fetching candidates...");
    
    const allCandidates = candidates.length ? candidates : await fetchAllCandidates();
    
    if (allCandidates.length === 0) {
      setDuplicatePairs([]);
      setScanning(false);
      setScanProgress("");
      return;
    }
    
    setScanProgress(`Analyzing ${allCandidates.length} candidates for duplicates...`);
    
    const pairs = await AIDuplicateDetector.findDuplicates(allCandidates);
    
    setDuplicatePairs(pairs);
    setScanProgress(`Found ${pairs.length} potential duplicate pairs`);
    
    if (pairs.length > 0 && !selectedPair) {
      setSelectedPair(pairs[0]);
    } else if (pairs.length === 0) {
      setSelectedPair(null);
    }
    
    setTimeout(() => setScanProgress(""), 2000);
    setScanning(false);
  };

  // Merge two duplicate profiles
  const mergeProfiles = async () => {
    if (!selectedPair) return;
    
    const { id1, id2, candidate1, candidate2 } = selectedPair;
    
    // Determine which profile to keep based on name selection
    const keepId = mergeStrategy.keepName === 'candidate1' ? id1 : id2;
    const removeId = keepId === id1 ? id2 : id1;
    const keepCandidate = keepId === id1 ? candidate1 : candidate2;
    const removeCandidate = keepId === id1 ? candidate2 : candidate1;
    
    // Merge data based on user strategy
    const mergedData: any = {};
    
    // Name selection
    mergedData.fullName = mergeStrategy.keepName === 'candidate1' ? candidate1.fullName : candidate2.fullName;
    
    // Email selection
    if (mergeStrategy.keepEmail === 'candidate1') {
      mergedData.email = candidate1.email;
    } else if (mergeStrategy.keepEmail === 'candidate2') {
      mergedData.email = candidate2.email;
    } else {
      mergedData.email = candidate1.email || candidate2.email;
    }
    
    // Phone selection
    if (mergeStrategy.keepPhone === 'candidate1') {
      mergedData.phone = candidate1.phone;
    } else if (mergeStrategy.keepPhone === 'candidate2') {
      mergedData.phone = candidate2.phone;
    } else {
      mergedData.phone = candidate1.phone || candidate2.phone;
    }
    
    // Location selection
    if (mergeStrategy.keepLocation === 'candidate1') {
      mergedData.location = candidate1.location;
    } else if (mergeStrategy.keepLocation === 'candidate2') {
      mergedData.location = candidate2.location;
    } else {
      mergedData.location = candidate1.location || candidate2.location;
    }
    
    // Skills selection
    if (mergeStrategy.keepSkills === 'combine') {
      mergedData.skills = [...new Set([...(candidate1.skills || []), ...(candidate2.skills || [])])];
    } else if (mergeStrategy.keepSkills === 'candidate1') {
      mergedData.skills = candidate1.skills || [];
    } else {
      mergedData.skills = candidate2.skills || [];
    }
    
    // Experience selection
    if (mergeStrategy.keepExperience === 'max') {
      mergedData.experienceYears = Math.max(candidate1.experienceYears || 0, candidate2.experienceYears || 0);
    } else if (mergeStrategy.keepExperience === 'candidate1') {
      mergedData.experienceYears = candidate1.experienceYears || 0;
    } else {
      mergedData.experienceYears = candidate2.experienceYears || 0;
    }
    
    // Interested field selection
    if (mergeStrategy.keepInterestedField === 'candidate1') {
      mergedData.interestedField = candidate1.interestedField;
    } else if (mergeStrategy.keepInterestedField === 'candidate2') {
      mergedData.interestedField = candidate2.interestedField;
    } else {
      mergedData.interestedField = candidate1.interestedField || candidate2.interestedField;
    }
    
    // Additional fields to keep
    mergedData.availability = candidate1.availability || candidate2.availability;
    mergedData.status = keepCandidate.status;
    mergedData.dateOfBirth = candidate1.dateOfBirth || candidate2.dateOfBirth;
    mergedData.linkedIn = candidate1.linkedIn || candidate2.linkedIn;
    mergedData.source = candidate1.source || candidate2.source;
    mergedData.cvFileName = candidate1.cvFileName || candidate2.cvFileName;
    mergedData.mergedFrom = [removeId];
    mergedData.mergedAt = new Date().toISOString();
    mergedData.duplicateResolved = true;
    
    const combinedExperienceText = `${mergedData.experienceYears} Years ${
      mergedData.experienceYears >= 8 ? '(Expert)' : 
      mergedData.experienceYears >= 5 ? '(Senior)' : 
      mergedData.experienceYears >= 2 ? '(Mid-Level)' : 
      mergedData.experienceYears > 0 ? '(Junior)' : '(Fresher)'
    }`;
    
    // Prepare merged profile data for navigation
    const mergedProfileData = {
      id: keepId,
      fullName: mergedData.fullName,
      email: mergedData.email,
      phone: mergedData.phone,
      skills: mergedData.skills,
      location: mergedData.location,
      experienceYears: mergedData.experienceYears,
      experienceText: combinedExperienceText,
      status: keepCandidate.status,
      interestedField: mergedData.interestedField,
      availability: mergedData.availability,
      role: mergedData.interestedField?.split('/')[0] || "Professional",
    };
    
    try {
      // Update kept profile with merged data
      await updateDoc(doc(db, "candidates", keepId), mergedData);
      // Delete duplicate profile
      await deleteDoc(doc(db, "candidates", removeId));
      
      // Update local state
      setMergedCount(prev => prev + 1);
      
      // Remove merged pair from list
      const remainingPairs = duplicatePairs.filter(p => 
        p.id1 !== id1 && p.id2 !== id1 && p.id1 !== id2 && p.id2 !== id2
      );
      setDuplicatePairs(remainingPairs);
      
      if (remainingPairs.length > 0) {
        setSelectedPair(remainingPairs[0]);
      } else {
        setSelectedPair(null);
      }
      
      // Refresh candidate list
      await fetchAllCandidates();
      
      // Navigate to ProfileMerge page
      navigate('/profile-merge', { state: { mergedProfile: mergedProfileData, removedId: removeId } });
      
    } catch (error) {
      console.error("Error merging profiles:", error);
      alert("Failed to merge profiles. Please try again.");
    }
  };

  // Ignore a duplicate pair - Navigate to ProfileCancel with candidate details
const ignorePair = () => {
  if (!selectedPair) return;
  
  // Prepare the data to pass to ProfileCancel page
  const cancelledData = {
    candidate1: selectedPair.candidate1,
    candidate2: selectedPair.candidate2,
    score: selectedPair.score,
    matchReason: selectedPair.matchReason,
    ignoredAt: new Date().toISOString(),
  };
  
  // Navigate to ProfileCancel page with the ignored pair data
  navigate('/profile-cancel', { state: { ignoredPair: cancelledData } });
};

  // Load initial data
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchAllCandidates();
      setLoading(false);
    };
    init();
  }, []);

  // Auto-run duplicate detection after candidates load
  useEffect(() => {
    if (candidates.length > 0 && duplicatePairs.length === 0 && !loading && !scanning) {
      runDuplicateDetection();
    }
  }, [candidates, loading]);

  // Filter pairs by search term
  const filteredPairs = duplicatePairs.filter(pair => 
    searchTerm === "" ||
    pair.candidate1.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pair.candidate2.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pair.candidate1.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pair.candidate2.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] p-8 font-sans text-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-500">Loading candidates from Firestore...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg shadow-blue-200 shadow-lg">
              <FiLayers className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Duplicate Resolution</h1>
            <span className="bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full flex items-center gap-1">
              <FiCpu className="w-3 h-3" /> AI-Powered
            </span>
          </div>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search duplicates..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-64"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Total Candidates</p>
            <p className="text-4xl font-bold text-slate-800">{candidates.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Duplicate Pairs Found</p>
            <p className="text-4xl font-bold text-blue-600">{duplicatePairs.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Resolved Merges</p>
            <p className="text-4xl font-bold text-slate-400">{mergedCount}</p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4">
            {selectedPair ? (
              <>
                <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${
                  selectedPair.score >= 85 
                    ? 'bg-rose-50 text-rose-600 border-rose-100' 
                    : selectedPair.score >= 70
                    ? 'bg-amber-50 text-amber-600 border-amber-100'
                    : 'bg-blue-50 text-blue-600 border-blue-100'
                }`}>
                  {selectedPair.score >= 85 ? 'HIGH MATCH' : selectedPair.score >= 70 ? 'MEDIUM MATCH' : 'LOW MATCH'} ({selectedPair.score}%)
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {selectedPair.matchReason}
                </span>
              </>
            ) : (
              <span className="text-xs text-slate-400">No duplicate pairs selected</span>
            )}
          </div>
          <div className="flex gap-3">
            <button 
              onClick={runDuplicateDetection}
              disabled={scanning}
              className="px-5 py-2 bg-[#6366F1] text-white text-sm font-bold rounded-lg hover:bg-indigo-600 transition shadow-md shadow-indigo-100 disabled:opacity-50"
            >
              {scanning ? 'Scanning...' : 'Scan All Candidates'}
            </button>
            {selectedPair && (
              <>
                <button 
                  onClick={mergeProfiles}
                  className="px-5 py-2 bg-[#10B981] text-white text-sm font-bold rounded-lg hover:bg-emerald-600 transition shadow-md shadow-emerald-100"
                >
                  Merge Profiles
                </button>
                <button 
                  onClick={ignorePair}
                  className="px-5 py-2 bg-[#F59E0B] text-white text-sm font-bold rounded-lg hover:bg-amber-600 transition shadow-md shadow-amber-100"
                >
                  Ignore
                </button>
              </>
            )}
          </div>
        </div>

        {/* Scan Progress */}
        {scanProgress && (
          <div className="mb-4 p-3 bg-blue-50 rounded-xl text-sm text-blue-700 flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
            {scanProgress}
          </div>
        )}

        {/* Profile Comparison Grid */}
        {selectedPair && (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Profile A */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-500"></div>
              <div className="flex justify-between items-start mb-8">
                <span className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-3 py-1 rounded-full border border-indigo-100 uppercase tracking-tighter">
                  Candidate Profile
                </span>
              </div>
              <div className="flex flex-col items-center mb-10">
                <div className="w-20 h-20 bg-slate-50 rounded-2xl mb-4 border border-slate-100 flex items-center justify-center">
                  <FiUser className="w-8 h-8 text-slate-400" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">{selectedPair.candidate1.fullName}</h2>
                <p className="text-xs text-slate-400 font-medium mt-1">
                  Added {selectedPair.candidate1.addedDate}
                </p>
              </div>
              <div className="space-y-5">
                <ProfileField 
                  label="Email Address" 
                  value={selectedPair.candidate1.email || 'Not provided'} 
                  isError={selectedPair.candidate1.email === selectedPair.candidate2.email && !!selectedPair.candidate1.email}
                />
                <ProfileField 
                  label="Phone Number" 
                  value={selectedPair.candidate1.phone || 'Not provided'} 
                />
                <ProfileField 
                  label="Primary Skills" 
                  value={selectedPair.candidate1.skills?.slice(0, 4).join(', ') || 'None'} 
                />
                <ProfileField 
                  label="Location" 
                  value={selectedPair.candidate1.location || 'Remote'} 
                />
                <ProfileField 
                  label="Status" 
                  value={selectedPair.candidate1.status || 'New'} 
                />
                {selectedPair.candidate1.cvFileName && (
                  <ProfileField 
                    label="CV Filename" 
                    value={selectedPair.candidate1.cvFileName} 
                  />
                )}
              </div>
            </div>

            {/* Profile B */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-rose-400"></div>
              <div className="flex justify-between items-start mb-8">
                <span className="bg-rose-50 text-rose-600 text-[10px] font-bold px-3 py-1 rounded-full border border-rose-100 uppercase tracking-tighter">
                  Potential Duplicate
                </span>
              </div>
              <div className="flex flex-col items-center mb-10">
                <div className="w-20 h-20 bg-slate-800 rounded-2xl mb-4 shadow-lg flex items-center justify-center text-white font-bold text-xl">
                  {selectedPair.candidate2.fullName?.[0] || '?'}
                </div>
                <h2 className="text-xl font-bold text-slate-800">{selectedPair.candidate2.fullName}</h2>
                <p className="text-xs text-slate-400 font-medium mt-1">
                  Added {selectedPair.candidate2.addedDate}
                </p>
              </div>
              <div className="space-y-5">
                <ProfileField 
                  label="Email Address" 
                  value={selectedPair.candidate2.email || 'Not provided'} 
                  isError={selectedPair.candidate1.email === selectedPair.candidate2.email && !!selectedPair.candidate2.email}
                />
                <ProfileField 
                  label="Phone Number" 
                  value={selectedPair.candidate2.phone || 'Not provided'} 
                  isMuted={!selectedPair.candidate2.phone}
                />
                <ProfileField 
                  label="Primary Skills" 
                  value={selectedPair.candidate2.skills?.slice(0, 4).join(', ') || 'None'} 
                />
                <ProfileField 
                  label="Location" 
                  value={selectedPair.candidate2.location || 'Remote'} 
                />
                <ProfileField 
                  label="Status" 
                  value={selectedPair.candidate2.status || 'New'} 
                />
                {selectedPair.candidate2.cvFileName && (
                  <ProfileField 
                    label="CV Filename" 
                    value={selectedPair.candidate2.cvFileName} 
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Merge Options - Enhanced with clickable selections */}
        {selectedPair && (
          <div className="mt-8 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Merge Strategy</h3>
              <FiShield className="text-slate-300 w-4 h-4" />
            </div>
            
            {/* Name Selection */}
            <div className="mb-6">
              <label className="text-xs font-semibold text-slate-600 mb-2 block">Select Primary Name</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <SelectableOption
                  label="KEEP THIS NAME"
                  value={selectedPair.candidate1.fullName}
                  isSelected={mergeStrategy.keepName === 'candidate1'}
                  onClick={() => setMergeStrategy({...mergeStrategy, keepName: 'candidate1'})}
                />
                <SelectableOption
                  label="OR THIS NAME"
                  value={selectedPair.candidate2.fullName}
                  isSelected={mergeStrategy.keepName === 'candidate2'}
                  onClick={() => setMergeStrategy({...mergeStrategy, keepName: 'candidate2'})}
                />
              </div>
            </div>
            
            {/* Email Selection */}
            <div className="mb-6">
              <label className="text-xs font-semibold text-slate-600 mb-2 block">Select Email</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <SelectableOption
                  label="EMAIL 1"
                  value={selectedPair.candidate1.email || 'Not provided'}
                  isSelected={mergeStrategy.keepEmail === 'candidate1'}
                  onClick={() => setMergeStrategy({...mergeStrategy, keepEmail: 'candidate1'})}
                />
                <SelectableOption
                  label="EMAIL 2"
                  value={selectedPair.candidate2.email || 'Not provided'}
                  isSelected={mergeStrategy.keepEmail === 'candidate2'}
                  onClick={() => setMergeStrategy({...mergeStrategy, keepEmail: 'candidate2'})}
                />
                <SelectableOption
                  label="BEST AVAILABLE"
                  value={selectedPair.candidate1.email || selectedPair.candidate2.email || 'No email'}
                  isSelected={mergeStrategy.keepEmail === 'auto'}
                  onClick={() => setMergeStrategy({...mergeStrategy, keepEmail: 'auto'})}
                  isItalic
                />
              </div>
            </div>
            
            {/* Phone Selection */}
            <div className="mb-6">
              <label className="text-xs font-semibold text-slate-600 mb-2 block">Select Phone Number</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <SelectableOption
                  label="PHONE 1"
                  value={selectedPair.candidate1.phone || 'Not provided'}
                  isSelected={mergeStrategy.keepPhone === 'candidate1'}
                  onClick={() => setMergeStrategy({...mergeStrategy, keepPhone: 'candidate1'})}
                />
                <SelectableOption
                  label="PHONE 2"
                  value={selectedPair.candidate2.phone || 'Not provided'}
                  isSelected={mergeStrategy.keepPhone === 'candidate2'}
                  onClick={() => setMergeStrategy({...mergeStrategy, keepPhone: 'candidate2'})}
                />
                <SelectableOption
                  label="BEST AVAILABLE"
                  value={selectedPair.candidate1.phone || selectedPair.candidate2.phone || 'No phone'}
                  isSelected={mergeStrategy.keepPhone === 'auto'}
                  onClick={() => setMergeStrategy({...mergeStrategy, keepPhone: 'auto'})}
                  isItalic
                />
              </div>
            </div>
            
            {/* Skills Selection */}
            <div className="mb-6">
              <label className="text-xs font-semibold text-slate-600 mb-2 block">Skills Strategy</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <SelectableOption
                  label="COMBINE ALL SKILLS"
                  value={`${new Set([...(selectedPair.candidate1.skills || []), ...(selectedPair.candidate2.skills || [])]).size} unique skills`}
                  isSelected={mergeStrategy.keepSkills === 'combine'}
                  onClick={() => setMergeStrategy({...mergeStrategy, keepSkills: 'combine'})}
                  isItalic
                />
                <SelectableOption
                  label="SKILLS FROM PROFILE 1"
                  value={`${selectedPair.candidate1.skills?.length || 0} skills`}
                  isSelected={mergeStrategy.keepSkills === 'candidate1'}
                  onClick={() => setMergeStrategy({...mergeStrategy, keepSkills: 'candidate1'})}
                />
                <SelectableOption
                  label="SKILLS FROM PROFILE 2"
                  value={`${selectedPair.candidate2.skills?.length || 0} skills`}
                  isSelected={mergeStrategy.keepSkills === 'candidate2'}
                  onClick={() => setMergeStrategy({...mergeStrategy, keepSkills: 'candidate2'})}
                />
              </div>
            </div>
            
            {/* Experience Selection */}
            <div className="mb-6">
              <label className="text-xs font-semibold text-slate-600 mb-2 block">Experience Strategy</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <SelectableOption
                  label="MAXIMUM EXPERIENCE"
                  value={`${Math.max(selectedPair.candidate1.experienceYears || 0, selectedPair.candidate2.experienceYears || 0)} years`}
                  isSelected={mergeStrategy.keepExperience === 'max'}
                  onClick={() => setMergeStrategy({...mergeStrategy, keepExperience: 'max'})}
                  isItalic
                />
                <SelectableOption
                  label="PROFILE 1 EXPERIENCE"
                  value={`${selectedPair.candidate1.experienceYears || 0} years`}
                  isSelected={mergeStrategy.keepExperience === 'candidate1'}
                  onClick={() => setMergeStrategy({...mergeStrategy, keepExperience: 'candidate1'})}
                />
                <SelectableOption
                  label="PROFILE 2 EXPERIENCE"
                  value={`${selectedPair.candidate2.experienceYears || 0} years`}
                  isSelected={mergeStrategy.keepExperience === 'candidate2'}
                  onClick={() => setMergeStrategy({...mergeStrategy, keepExperience: 'candidate2'})}
                />
              </div>
            </div>
            
            <p className="text-[10px] text-slate-400 mt-4 text-center">
              Click on any option above to customize how profiles are merged
            </p>
          </div>
        )}

        {/* Duplicate List Table */}
        <div className="mt-8 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-50 flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Detected Duplicates ({filteredPairs.length})
            </h3>
            <button 
              onClick={runDuplicateDetection}
              disabled={scanning}
              className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <FiRefreshCcw className="w-3 h-3" /> Refresh
            </button>
          </div>
          <div className="divide-y divide-slate-50 max-h-96 overflow-y-auto">
            {filteredPairs.length > 0 ? (
              filteredPairs.map((pair) => (
                <TaskRow 
                  key={`${pair.id1}-${pair.id2}`}
                  name={`${pair.candidate1.fullName} vs. ${pair.candidate2.fullName}`}
                  match={`${pair.score}%`}
                  isActive={selectedPair?.id1 === pair.id1 && selectedPair?.id2 === pair.id2}
                  onClick={() => setSelectedPair(pair)}
                />
              ))
            ) : (
              <div className="p-8 text-center text-slate-400">
                {duplicatePairs.length === 0 && !scanning 
                  ? '✅ No duplicates detected! All candidate profiles are unique.' 
                  : searchTerm 
                    ? 'No matching duplicates found for your search.'
                    : 'No duplicate pairs detected'}
              </div>
            )}
          </div>
        </div>

        {/* Info Footer */}
        <div className="mt-6 text-center text-[10px] text-slate-400">
          <span className="flex items-center justify-center gap-2">
            <FiCpu className="w-3 h-3" /> AI-powered duplicate detection using fuzzy matching + Gemini AI (free tier)
          </span>
        </div>

      </div>
    </div>
  );
};

export default DuplicateResolution;