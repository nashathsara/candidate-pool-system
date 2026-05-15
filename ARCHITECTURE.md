# Candidate Pool System - Architecture Overview

## 🏗️ System Architecture

### Page Flow Integration

```
1. SECURE ACCESS START (Admin Login with RBAC)
   └─→ RBACContext + RouteGuards

2. SMART DASHBOARD (AI + Insights)
   └─→ AdminDashboardWrapper (RBAC-filtered data)

3. ADVANCED SEARCH
   └─→ Candidate search with filters

4. CANDIDATE PROFILE
   └─→ ProfileCreate (with Smart Matching)
   └─→ Dynamic Skills Loading (side effect)

5. COLLABORATION & NOTES
   └─→ Duplicate detection (Smart Matching)
   └─→ Profile merge/cancel

6. ACTIONS
   └─→ Notifications & verification

7. INTERVIEW MANAGEMENT
   └─→ Schedule & track

8. AUTOMATION LAYER
   └─→ Auto-shortlist & responses

9. FINAL STATE
   └─→ Hired / In Pipeline
```

---

## 📁 Complete Project Structure

```
frontend/src/
│
├── AppRoutes.tsx ⭐ (UPDATED)
│   └─ Integrated RBAC route guards
│
├── contexts/
│   ├── AuthContext.tsx (existing)
│   └── RBACContext.tsx ⭐ (NEW)
│       └─ Role/Permission management
│
├── components/
│   ├── RouteGuards.tsx ⭐ (NEW)
│   │   ├─ RequireAuth
│   │   ├─ RequireAdminRole
│   │   ├─ RequireRecruiterOrAdmin
│   │   ├─ RequirePermission
│   │   └─ AccessDenied
│   │
│   └── admin/AdminDashboard/
│       ├── AdminDashboard.tsx (existing)
│       └── AdminDashboardWrapper.tsx ⭐ (NEW)
│           └─ RBAC data filtering
│
├── services/
│   ├── duplicateDetection.js (existing)
│   ├── skillsService.ts ⭐ (NEW)
│   │   ├─ getSkillsByField()
│   │   ├─ getAllFields()
│   │   └─ calculateSkillMatch()
│   │
│   └── smartMatchingService.ts ⭐ (NEW)
│       ├─ performSmartMatch()
│       ├─ validateCandidateForMatching()
│       └─ formatSmartMatchResult()
│
├── pages/
│   ├── ProfileCreate/
│   │   ├── ProfileCreate.tsx ⭐ (ENHANCED)
│   │   │   ├─ Dynamic skills loading (useEffect)
│   │   │   ├─ Smart matching (debounced useEffect)
│   │   │   ├─ Form validation
│   │   │   └─ Success state logic
│   │   └── ProfileCreate.css ⭐ (NEW)
│   │
│   └── ... (other pages)
│
└── hooks/
    ├── useAuth.ts (existing)
    └── useRBAC.ts (optional - custom hook wrapper)
```

---

## 🔐 RBAC Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    User Authentication                       │
│                    (Firebase Auth)                           │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
          ┌──────────────────────────────┐
          │   useAuth() - Get Firebase    │
          │   User & ID Token            │
          └──────────┬───────────────────┘
                     │
                     ↓
          ┌──────────────────────────────┐
          │  RBACContext - Fetch Role    │
          │  from Firestore users/uid    │
          └──────────┬───────────────────┘
                     │
                     ↓
    ┌─────────────────────────────────────┐
    │   Determine Permissions Based on    │
    │   Role (admin/recruiter/...         │
    │   hiring_manager/candidate)         │
    └──────────┬──────────────────────────┘
               │
       ┌───────┴───────┬───────────┬──────────┐
       │               │           │          │
       ↓               ↓           ↓          ↓
     Admin          Recruiter   Hiring      Candidate
     (Full)         (Most)     Manager      (Limited)
       │               │           │          │
       ├─ All routes   ├─ Dashboard ├─ Dashboard
       ├─ RBAC guards  ├─ Candidates├─ Interviews
       ├─ Features     ├─ Duplicates├─ Outcomes
       └─ Data access  ├─ Interviews└─ No admin
                       └─ Team mgmt
                           ❌ (No)
```

---

## 🎯 Smart Matching Flow

### Timeline Sequence

```
User fills ProfileCreate form
           │
           ├─ fullName: "John Doe"
           ├─ phone: "+1-555-123-4567"
           └─ dateOfBirth: "1990-01-15"
           
           ↓ (onChange event)
           
useEffect triggers (debounce 1500ms)
           │
           ├─ Wait 1.5 seconds for user to stop typing
           └─ If values changed → execute matching
           
           ↓
performSmartMatch(candidateData)
           │
           ├─ Normalize phone & DOB
           │
           ├─ findDuplicatesOptimized()
           │  ├─ Check email match (95% confidence)
           │  ├─ Check phone match (70-90%)
           │  └─ Check name similarity (60-80%)
           │
           └─ Generate SmartMatchResult
           
           ↓
Result contains:
  ├─ isDuplicate: true/false
  ├─ confidenceScore: 0-100
  ├─ matchFields: { name, dob, phone }
  ├─ existingCandidate: {...}
  └─ canProceedToSuccess: true/false
           
           ↓
Display Status Banner:
  ├─ ✅ UNIQUE PROFILE → User can submit
  ├─ ⚠️ REVIEW NEEDED → Blocked, needs admin review
  └─ 🔴 DUPLICATE → Blocked, contact support
           
           ↓
User clicks "Submit"
           │
           ├─ validateForm() checks:
           │  ├─ All required fields filled
           │  ├─ smartMatchResult.canProceedToSuccess === true
           │  └─ No validation errors
           │
           ├─ If valid: saveNewCandidateOptimized()
           ├─ If invalid: display errors
           │
           └─ On success: navigate to /profile-merge
```

### Confidence Score Calculation

```
Match Weights:
  Name similarity:  40%
  Phone match:      35%
  DOB match:        25%
  ─────────────────────
  Total:           100%

Examples:
  ┌─────────────────────────────────────┐
  │ Match Result      │ Score │ Action  │
  ├─────────────────────────────────────┤
  │ All 3 match       │ 100%  │ Block   │
  │ Phone + Name      │ 75%   │ Review  │
  │ Phone only        │ 35%   │ Allow   │
  │ Name similarity   │ 40%   │ Allow   │
  │ No match          │ 0%    │ Allow   │
  └─────────────────────────────────────┘
```

---

## 🎨 Dynamic Skills Loading

### Data Flow

```
SELECT interestedField
         │
         ↓ (onChange)
         
User chooses "Software Engineering"
         │
         ↓ (triggers useEffect)
         
getSkillsByField("Software Engineering")
         │
         ├─ Lookup FIELD_SKILLS_MAP
         └─ Return array:
            [
              "React.js",
              "TypeScript",
              "Node.js",
              "Docker",
              "AWS",
              "REST APIs",
              "Git",
              "SQL",
              "MongoDB",
              "Microservices"
            ]
         │
         ↓
setSuggestedSkills(skills)
setSuggestedSkills(skills.slice(0, 5))
         │
         ├─ ["React.js", "TypeScript", "Node.js", "Docker", "AWS"]
         └─ Pre-selected for user
         │
         ↓
Render skill badges with toggle:
  ☑ React.js
  ☑ TypeScript
  ☑ Node.js
  ☑ Docker
  ☑ AWS
  ☐ REST APIs
  ☐ Git
  ... (show 5 selected, rest hidden)
```

### Field-to-Skills Mapping

```typescript
{
  "Software Engineering": [
    React.js, TypeScript, Node.js, Docker, AWS, REST APIs, Git, SQL, MongoDB, Microservices
  ],
  
  "Data Science": [
    Python, Machine Learning, TensorFlow, Pandas, Jupyter, SQL, Statistics, Data Visualization, PyTorch, Scikit-learn
  ],
  
  "Product Management": [
    Product Strategy, Roadmapping, User Research, Analytics, A/B Testing, Agile, Stakeholder Management, Figma, JIRA, OKRs
  ],
  
  "Design": [
    UI/UX Design, Figma, Prototyping, User Research, Wireframing, Design Systems, Sketch, Adobe XD, Accessibility, CSS
  ],
  
  "Cybersecurity": [
    Network Security, Penetration Testing, Firewalls, Cryptography, SIEM, Risk Assessment, Incident Response, OWASP, Linux, Python
  ],
  
  "Infrastructure Engineering": [
    Kubernetes, Terraform, CI/CD, AWS, Docker, Linux, Monitoring, Ansible, GCP, Infrastructure as Code
  ]
}
```

---

## 🛡️ Admin Dashboard RBAC

### Data Filtering Logic

```
AdminDashboardWrapper receives: pipelineCandidates[]

↓ Check user.role

┌─────────────────────────────────────────┐
│ Admin Role                              │
├─────────────────────────────────────────┤
│ Can view: ALL candidates                │
│ Features:  All admin features           │
│ Actions:   All actions available        │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Recruiter Role                          │
├─────────────────────────────────────────┤
│ Can view: ALL candidates                │
│ Features: Duplicates, Interviews        │
│ Actions:  Most actions                  │
│ Cannot:   Manage teams, Automation      │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Hiring Manager Role                     │
├─────────────────────────────────────────┤
│ Can view: Their department only         │
│          .filter(c => c.department      │
│            === manager.department)      │
│ Features: Interviews, Outcomes          │
│ Actions:  Limited actions               │
│ Cannot:   View all candidates           │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Candidate Role                          │
├─────────────────────────────────────────┤
│ Can view: NOTHING                       │
│ See:      Access Denied page            │
│ Redirect: /candidate-dashboard          │
└─────────────────────────────────────────┘
```

### Feature Availability Matrix

```
┌─────────────┬───────┬──────────┬─────────┬──────────┐
│ Feature     │ Admin │ Recruiter│ Manager │ Candidate│
├─────────────┼───────┼──────────┼─────────┼──────────┤
│ Dashboard   │   ✅  │    ✅    │   ✅    │    ❌    │
│ Candidates  │   ✅  │    ✅    │   ⚠️*   │    ❌    │
│ Duplicates  │   ✅  │    ✅    │   ❌    │    ❌    │
│ Interviews  │   ✅  │    ✅    │   ✅    │    ❌    │
│ Outcomes    │   ✅  │    ✅    │   ✅    │    ❌    │
│ Automation  │   ✅  │    ❌    │   ❌    │    ❌    │
│ Team Mgmt   │   ✅  │    ❌    │   ❌    │    ❌    │
│ Settings    │   ✅  │    ❌    │   ❌    │    ❌    │
└─────────────┴───────┴──────────┴─────────┴──────────┘

* = Limited to their department
```

---

## 📊 Data Models

### SmartMatchResult

```typescript
{
  isDuplicate: boolean;              // true if high confidence duplicate
  confidenceScore: number;           // 0-100
  matchFields: {
    name: boolean;                   // name matched
    dob: boolean;                    // date of birth matched
    phone: boolean;                  // phone matched
  };
  existingCandidate: CandidateRecord | null;  // the duplicate
  requiresReview: boolean;           // needs manual admin review
  message: string;                   // human readable message
  canProceedToSuccess: boolean;      // form can be submitted
}
```

### RBACUser

```typescript
{
  user: FirebaseUser | null;         // Firebase Auth user
  role: UserRole | null;             // admin | recruiter | hiring_manager | candidate
  permissions: {
    canViewDashboard: boolean;
    canViewCandidates: boolean;
    canViewDuplicates: boolean;
    canMergeDuplicates: boolean;
    canManageInterviews: boolean;
    canViewReports: boolean;
    canManageTeam: boolean;
  };
  loading: boolean;
  isSignedIn: boolean;
}
```

### Candidate (Firestore)

```typescript
{
  id: string;                        // Firestore doc ID
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;               // YYYY-MM-DD
  linkedinUrl?: string;
  interestedField: FieldType;
  yearsOfExperience: number;
  skills: string[];
  currentStatus: "actively_looking" | "open_to_opportunities";
  availability: "immediate" | "1_month" | "3_months";
  salary: { min: number; max: number };
  cvFile: string;
  willBeContacted: boolean;
  
  metadata: {
    source: string;
    duplicateCheckPerformed: boolean;
    smartMatchResult: SmartMatchResult;
  };
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
  status: "active" | "inactive" | "hired";
}
```

---

## 🔄 Integration Points

### 1. Firebase Firestore

```
Collections:
├── users/
│   └── {uid}
│       ├── role: "admin" | "recruiter" | "hiring_manager"
│       ├── email: string
│       └── ...metadata
│
├── candidates/
│   └── {candidateId}
│       ├── fullName, email, phone, dateOfBirth
│       ├── skills: string[]
│       ├── duplicateCheckPerformed: boolean
│       └── ...profile data
│
└── duplicate_tickets/
    └── {ticketId}
        ├── primaryCandidateId: string
        ├── duplicateCandidateData: {...}
        ├── confidenceScore: number
        └── status: "pending" | "merged" | "ignored"
```

### 2. Authentication Flow

```
App.tsx
  ├─ RBACProvider (wraps app)
  │  └─ AuthContext
  │     └─ useAuth() hook
  │
  └─ AppRoutes
     ├─ RequireAuth guard
     ├─ RequireAdminRole guard
     ├─ RequirePermission guard
     └─ Protected pages
```

### 3. Form Submission Flow

```
ProfileCreate.tsx
  │
  ├─ State: formData, smartMatchResult
  │
  ├─ useEffect #1: Load skills on field change
  │
  ├─ useEffect #2: Trigger smart matching on form change (debounced)
  │
  ├─ handleSubmit()
  │  ├─ validateForm()
  │  ├─ Check smartMatchResult.canProceedToSuccess
  │  ├─ saveNewCandidateOptimized(candidateData)
  │  └─ Navigate to /profile-merge
  │
  └─ UI displays:
     ├─ Smart match status banner
     ├─ Field-specific errors
     ├─ Dynamic skills badges
     └─ Submit button (enabled/disabled)
```

---

## 🧪 Testing Strategies

### Unit Tests

```typescript
// skillsService.ts
test('getSkillsByField returns correct skills', () => {
  const skills = getSkillsByField("Software Engineering");
  expect(skills).toContain("React.js");
  expect(skills).toContain("TypeScript");
});

// smartMatchingService.ts
test('performSmartMatch detects duplicates', async () => {
  const result = await performSmartMatch({
    fullName: "John Doe",
    phone: "+1-555-123-4567"
  });
  expect(result.isDuplicate).toBe(true);
  expect(result.confidenceScore).toBeGreaterThan(70);
});

// RouteGuards.tsx
test('RequireAdminRole redirects non-admins', () => {
  const { useRBAC } = require('../contexts/RBACContext');
  useRBAC.mockReturnValue({ role: 'candidate' });
  
  render(
    <RequireAdminRole>
      <div>Admin Content</div>
    </RequireAdminRole>
  );
  
  expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
});
```

### Integration Tests

```typescript
test('Profile creation with smart matching flow', async () => {
  render(<ProfileCreate />);
  
  // Fill form
  fireEvent.change(screen.getByLabelText('Full Name'), {
    target: { value: 'Test User' }
  });
  
  // Wait for smart matching
  await waitFor(() => {
    expect(screen.getByText('Checking for duplicates...')).toBeInTheDocument();
  });
  
  // Submit form
  fireEvent.click(screen.getByText('Complete Registration'));
  
  // Verify submission
  await waitFor(() => {
    expect(screen.getByText('Profile created successfully!')).toBeInTheDocument();
  });
});
```

---

## 🚀 Deployment Checklist

- [ ] Verify RBAC roles in Firestore
- [ ] Test all role-based routes
- [ ] Validate smart matching algorithm
- [ ] Test form submission with duplicates
- [ ] Verify skill loading for all fields
- [ ] Check RBAC guards on admin pages
- [ ] Test profile merge success flow
- [ ] Verify error handling and messages
- [ ] Performance test smart matching (1000+ candidates)
- [ ] Test on mobile devices
- [ ] Verify accessibility (WCAG 2.1)
- [ ] Load test route guards
- [ ] Security review RBAC implementation

---

## 📝 Environment Variables

```env
# .env.local (development)
VITE_API_BASE_URL=http://localhost:3001
VITE_FIREBASE_PROJECT_ID=candidate-pool-dev
VITE_ENABLE_LOGGING=true

# .env.production
VITE_API_BASE_URL=https://api.candidatepool.com
VITE_FIREBASE_PROJECT_ID=candidate-pool-prod
VITE_ENABLE_LOGGING=false
```

---

## 🔗 Related Documents

- [RBAC_SMART_MATCHING_IMPLEMENTATION.md](./RBAC_SMART_MATCHING_IMPLEMENTATION.md) - Detailed implementation guide
- [CANDIDATE_REGISTRATION_FLOW.md](./CANDIDATE_REGISTRATION_FLOW.md) - Registration flow documentation
- [ROUTING_ARCHITECTURE.md](./ROUTING_ARCHITECTURE.md) - Routing documentation
