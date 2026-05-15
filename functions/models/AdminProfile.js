// functions/src/models/User.js
class AdminProfile {
    constructor(data) {
        this.uid = data.uid || "";
        this.email = data.email || "";
        this.fullName = data["fullName"] || ""; // Maps the database space string
        this.bio = data.bio || "";
        this.profilePhoto = data.profilePhoto || "";
        this.profileVisibility = data.profileVisibility ?? true; 
        this.updatedAt = data.updatedAt || new Date().toISOString();
    }

    toFirestore() {
        return {
            uid: this.uid,
            email: this.email,
            "full name": this.fullName, // Explicitly writes with a space to Firestore
            bio: this.bio,
            profilePhoto: this.profilePhoto,
            profileVisibility: this.profileVisibility,
            updatedAt: new Date().toISOString()
        };
    }
}

module.exports = AdminProfile;