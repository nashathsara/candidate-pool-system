class Candidate {
  constructor(data) {
    
    this.fullName = data.fullName || "";
    this.email = data.email || "";
    this.password = data.password || ""; 

    
    this.bio = data.bio || ""; 
    this.phone = data.phone || "N/A";     
    this.dob = data.dob || "N/A";
    this.interestedField = data.interestedField || "N/A";
    this.linkedinUrl = data.linkedinUrl || "N/A";
    
   
    this.status = data.status || "In Review"; 
    this.statusTone = data.statusTone || "blue"; 
    this.verificationStatus = data.verificationStatus || "In Review";
    this.reviewedBy = data.reviewedBy || "admin";
    this.lastActiveLabel = data.lastActiveLabel || "Just now";
    
    
    this.isVerified = data.isVerified || false; 
    this.isVisible = data.isVisible !== undefined ? data.isVisible : true;

    // User role for RBAC (admin, recruiter, hiring_manager, candidate)
    this.userRole = data.userRole || 'candidate';
    
    const now = new Date().toISOString();
    this.createdAt = now;
    this.updatedAt = now;
  }
}

module.exports = Candidate;