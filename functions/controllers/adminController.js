// functions/src/controllers/adminController.js
const { db, auth } = require('../config/firebase');

// 1. Get Admin Profile details
exports.getAdminProfile = async (req, res) => {
    try {
        const { uid } = req.params;
        if (!uid) return res.status(400).json({ error: "UID is required" });

        const doc = await db.collection('adminProfiles').doc(uid).get();
        if (!doc.exists) {
            return res.status(404).json({ error: "Admin profile not found" });
        }

        return res.status(200).json(doc.data());
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// 2. Update Admin Profile Workspace Settings
exports.updateAdminProfile = async (req, res) => {
    try {
        const { uid, fullName, bio, profilePhoto, profileVisibility } = req.body;
        if (!uid) return res.status(400).json({ error: "UID is required" });

        const adminRef = db.collection('adminProfiles').doc(uid);

        // Build update object dynamically to only update changed values
        const updateData = {
            updatedAt: new Date().toISOString()
        };

        if (fullName !== undefined) updateData["full name"] = fullName; // Notice the exact space string matching the table field
        if (bio !== undefined) updateData.bio = bio;
        if (profilePhoto !== undefined) updateData.profilePhoto = profilePhoto;
        if (profileVisibility !== undefined) updateData.profileVisibility = profileVisibility;

        await adminRef.set(updateData, { merge: true });

        return res.status(200).json({ message: "Admin workspace settings saved successfully!" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// 3. Change Password securely
exports.changePassword = async (req, res) => {
    try {
        const { uid, newPassword } = req.body;
        if (!uid || !newPassword) {
            return res.status(400).json({ error: "UID and new password are required" });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters." });
        }

        await auth.updateUser(uid, { password: newPassword });
        return res.status(200).json({ message: "Password updated successfully!" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};