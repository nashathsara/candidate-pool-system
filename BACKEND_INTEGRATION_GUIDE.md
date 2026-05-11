# Backend Integration Guide - Firebase Services

## Overview
Your backend is now connected to Firebase v10+. Below is how to access it from each page.

---

## 1. Sign In Page (`SignIn.tsx`)

### Import Firebase Auth Functions
```typescript
import { signInWithEmailPassword, signInWithGoogle, signInWithLinkedIn } from '../services/firebaseService';
import { useAuth } from '../hooks/useAuth';
```

### Use Auth Hook to Check Sign-In State
```typescript
const { user, loading, isSignedIn } = useAuth();

// After user signs in, redirect them
useEffect(() => {
  if (isSignedIn && !loading) {
    navigate('/browse'); // Redirect to Browse Jobs after sign-in
  }
}, [isSignedIn, loading, navigate]);
```

### Email/Password Sign-In
```typescript
const handleSignIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailPassword(email, password);
    console.log('Signed in:', userCredential.user.uid);
    // Navigate to /browse or dashboard
  } catch (error) {
    console.error('Sign-in failed:', error.message);
  }
};
```

### Google Sign-In
```typescript
const handleGoogleSignIn = async () => {
  try {
    const userCredential = await signInWithGoogle();
    console.log('Google Sign-In successful:', userCredential.user.uid);
  } catch (error) {
    console.error('Google Sign-In failed:', error.message);
  }
};
```

### LinkedIn Sign-In
```typescript
const handleLinkedInSignIn = async () => {
  try {
    const userCredential = await signInWithLinkedIn();
    console.log('LinkedIn Sign-In successful:', userCredential.user.uid);
  } catch (error) {
    console.error('LinkedIn Sign-In failed:', error.message);
  }
};
```

---

## 2. Browse Jobs Page (`BrowseJobs.tsx`)

### Import and Fetch Jobs
```typescript
import { fetchJobs } from '../services/firebaseService';
import { useState, useEffect } from 'react';

function BrowseJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastVisible, setLastVisible] = useState(null);
  const [filters, setFilters] = useState({});

  // Load jobs on component mount or when filters/page changes
  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);
        const { jobs: fetchedJobs, lastVisible: newLastVisible } = await fetchJobs(
          filters,
          6, // pageSize
          page === 1 ? null : lastVisible,
        );
        setJobs(fetchedJobs);
        setLastVisible(newLastVisible);
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [filters, page, lastVisible]);

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to page 1 when filters change
    setLastVisible(null);
  };

  // Handle pagination
  const handleNextPage = () => {
    if (lastVisible) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div>
      {/* Your UI here */}
      {loading && <p>Loading jobs...</p>}
      {!loading && jobs.map((job) => (
        <div key={job.id}>
          <h3>{job.title}</h3>
          <p>{job.location}</p>
          {/* ... */}
        </div>
      ))}
    </div>
  );
}
```

### Filter Example
```typescript
// User selects department, location, job type
const filters = {
  department: 'Engineering',
  location: 'Remote',
  jobType: 'Full-time',
};
const { jobs, lastVisible } = await fetchJobs(filters);
```

---

## 3. Application Success Page (`ApplicationSuccess.tsx`)

### Import and Submit Application
```typescript
import { submitApplication } from '../services/firebaseService';
import { useAuth } from '../hooks/useAuth';
import { useParams } from 'react-router-dom';

function ApplicationSuccess() {
  const { jobId } = useParams(); // Get jobId from route params
  const { user, isSignedIn } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  // Submit application on page load
  useEffect(() => {
    const submitAppOnLoad = async () => {
      if (!isSignedIn || !user || !jobId) return;

      try {
        setSubmitting(true);
        const result = await submitApplication(jobId, {
          // Optional: Add extra user data
          firstName: 'John',
          lastName: 'Doe',
          email: user.email,
          phone: '+1234567890',
        });
        console.log('Application submitted:', result.applicationId);
        // Show success message or redirect
      } catch (error) {
        console.error('Failed to submit application:', error);
      } finally {
        setSubmitting(false);
      }
    };

    submitAppOnLoad();
  }, [jobId, user, isSignedIn]);

  return (
    <div>
      {submitting && <p>Submitting application...</p>}
      <p>Your application has been successfully submitted!</p>
      {/* ... */}
    </div>
  );
}
```

---

## 4. Support Ticket Page (`SupportTicket.tsx`)

### Import and Create Ticket with File Upload
```typescript
import { uploadTicketAttachment, createTicket } from '../services/firebaseService';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';

function SupportTicket() {
  const { user, isSignedIn } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [attachmentURL, setAttachmentURL] = useState(null);

  // Handle file upload
  const handleFileUpload = async (file) => {
    if (!isSignedIn) {
      alert('You must be signed in to upload files');
      return;
    }

    try {
      setUploading(true);
      const url = await uploadTicketAttachment(file);
      setAttachmentURL(url);
      console.log('File uploaded:', url);
    } catch (error) {
      console.error('Upload failed:', error.message);
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  // Handle ticket submission
  const handleSubmitTicket = async (ticketData) => {
    if (!isSignedIn) {
      alert('You must be signed in to submit a ticket');
      return;
    }

    try {
      const result = await createTicket({
        subject: ticketData.subject,
        category: ticketData.category,
        description: ticketData.description,
        attachmentURL: attachmentURL,
        status: 'open',
      });
      console.log('Ticket created:', result.ticketId);
      alert('Support ticket submitted successfully!');
      // Reset form
      setAttachmentURL(null);
    } catch (error) {
      console.error('Failed to create ticket:', error.message);
      alert('Failed to submit ticket: ' + error.message);
    }
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          handleSubmitTicket({
            subject: formData.get('subject'),
            category: formData.get('category'),
            description: formData.get('description'),
          });
        }}
      >
        <input name="subject" placeholder="Subject" required />
        <select name="category" required>
          <option value="">Select category</option>
          <option value="Bug Report">Bug Report</option>
          <option value="Feature Request">Feature Request</option>
          <option value="General Support">General Support</option>
        </select>
        <textarea name="description" placeholder="Description" required />

        <input
          type="file"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              handleFileUpload(e.target.files[0]);
            }
          }}
          accept=".png,.jpg,.jpeg,.pdf"
        />
        {uploading && <p>Uploading...</p>}
        {attachmentURL && <p>✓ File uploaded</p>}

        <button type="submit" disabled={uploading}>
          Submit Ticket
        </button>
      </form>
    </div>
  );
}
```

---

## 5. Environment Variables

Create a `.env.local` file in `frontend/` with your Firebase config:

```
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Where to find these values:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click ⚙️ (Project Settings)
4. Scroll to "Your apps" section
5. Find your web app and click "Config"
6. Copy the values

---

## 6. Quick Reference - Service Functions

| Function | Location | Purpose |
|----------|----------|---------|
| `signInWithEmailPassword(email, password)` | `config/firebase.js` | Email/password auth |
| `signInWithGoogle()` | `config/firebase.js` | Google OAuth |
| `signInWithLinkedIn()` | `config/firebase.js` | LinkedIn OAuth |
| `useAuth()` | `hooks/useAuth.ts` | Get current user state |
| `fetchJobs(filters, pageSize, startAfterDoc)` | `services/firebaseService.ts` | Get jobs with pagination |
| `submitApplication(jobId, userData)` | `services/firebaseService.ts` | Save application |
| `uploadTicketAttachment(file)` | `services/firebaseService.ts` | Upload file to storage |
| `createTicket(ticketData)` | `services/firebaseService.ts` | Save support ticket |

---

## 7. Firestore Collections Structure

### `jobs` Collection
```json
{
  "id": "job_001",
  "title": "Senior Software Engineer",
  "department": "Engineering",
  "location": "Remote",
  "jobType": "Full-time",
  "salary": "$140k - $190k",
  "description": "...",
  "createdAt": "timestamp"
}
```

### `applications` Collection
```json
{
  "id": "app_001",
  "userId": "firebase_user_uid",
  "jobId": "job_001",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "status": "submitted",
  "createdAt": "timestamp"
}
```

### `tickets` Collection
```json
{
  "id": "ticket_001",
  "userId": "firebase_user_uid",
  "subject": "Login issue",
  "category": "Bug Report",
  "description": "...",
  "attachmentURL": "https://storage.googleapis.com/...",
  "status": "open",
  "createdAt": "timestamp"
}
```

---

## 8. Testing the Backend

### With Vite Dev Server
```bash
cd frontend
npm run dev
```

Then open `http://localhost:5173` in your browser.

### Check Firestore Data
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project → Firestore Database
3. Check the `jobs`, `applications`, and `tickets` collections

### Check Storage Uploads
1. Go to Firebase Console → Storage
2. Check the `tickets/` folder for uploaded files

---

## Error Handling Tips

- **"User must be signed in"**: User is not authenticated. Show login prompt.
- **"Only JPEG, PNG, and PDF attachments are allowed"**: File type not supported.
- **"Upload failed"**: Check Storage Rules or file size (max 10MB).
- **"Property does not exist on type"**: Check Firestore document structure matches expected schema.

---

## Next Steps

1. Add Firebase credentials to `.env.local`
2. Test sign-in with each auth method
3. Create test data in Firestore (or use Cloud Functions)
4. Integrate backend calls into each component
5. Deploy to Firebase Hosting when ready
