class Candidate {
  constructor(data) {
    this.fullName = data.fullName || "";
    this.email = data.email || "";
    this.password = data.password || ""; 
    this.phone = data.phone || "N/A";     
    this.dob = data.dob || "N/A";
    this.interestedField = data.interestedField || "N/A";
    this.linkedinUrl = data.linkedinUrl || "N/A";
    this.status = data.status || "In Review";
    this.createdAt = new Date().toISOString();
  }
}

module.exports = Candidate;