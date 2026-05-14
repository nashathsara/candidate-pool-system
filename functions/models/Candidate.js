// functions/models/Candidate.js
class Candidate {
  constructor(data) {
    this.fullName = data.fullName || "";
    this.email = data.email || "";
    this.password = data.password || ""; // පාස්වර්ඩ් එකත් එකතු කළා
    this.phone = data.phone || "N/A";     // අගයක් නැත්නම් default අගයක් දෙනවා
    this.dob = data.dob || "N/A";
    this.interestedField = data.interestedField || "N/A";
    this.linkedinUrl = data.linkedinUrl || "N/A";
    this.status = data.status || "In Review";
    this.createdAt = new Date().toISOString();
  }
}

module.exports = Candidate;