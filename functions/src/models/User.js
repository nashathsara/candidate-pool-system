const userModel = (data) => ({
  fullName: data.fullName,
  email: data.email,
  role: data.role || 'Admin',
  createdAt: new Date().toISOString(),
  uid: data.uid // Linking the Firestore doc to the Auth ID
});

module.exports = userModel;