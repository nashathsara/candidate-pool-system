# RBAC & Smart Matching Implementation Guide

## Overview

This document outlines the complete implementation of:
1. **React/Next.js Routing Structure** with RBAC (Role-Based Access Control)
2. **Profile Creation Page** with dynamic skills loading
3. **Smart Matching Logic** comparing Name, DOB, and Phone
4. **Admin Dashboard** with RBAC-restricted data views

---

## 1. Routing Architecture

### File Structure
```
frontend/src/
├── AppRoutes.tsx (Updated with RBAC guards)
├── components/
│   ├── RouteGuards.tsx (NEW - RBAC route protection)
│   └── admin/AdminDashboard/
│       └── AdminDashboardWrapper.tsx (NEW - RBAC-aware wrapper)
├── contexts/
│   └── RBACContext.tsx (NEW - Role/Permission management)
├── hooks/
│   └── useAuth.ts (Existing - extend with RBAC)
├── pages/
│   └── ProfileCreate/
│       └── ProfileCreate.tsx (Enhanced with smart matching)
└── services/
    ├── skillsService.ts (NEW - Dynamic skills)
    └── smartMatchingService.ts (NEW - Duplicate detection)
```

### Public Routes (No Auth Required)
```
GET  /                    → Home
GET  /home                → Home
GET  /signin              → SignIn
GET  /signup              → Signup
GET  /EmailVerification   → EmailVerification
GET  /verified            → VerificationSuccess
```

### Candidate Routes (Authenticated)
```
GET  /profile/create      → ProfileCreate (with smart matching)
GET  /browse              → BrowseJobs
GET  /applications        → Applications
GET  /candidate-dashboard → CandidateDashboard
GET  /profile-merge       → ProfileMerge
GET  /support             → TicketSubmitForm
GET  /ticket-success      → TicketSuccess
GET  /settings            → CandidateSettings
GET  /help                → HelpCenter
GET  /profile-cancel      → ProfileCancel
```

### Admin Routes (Role-Based Access Control)
```
GET  /dashboard           → AdminDashboardPage (Admin/Recruiter/Hiring Manager)
GET  /candidates          → Candidates (Admin/Recruiter)
GET  /candidate-profile/:id → ProfileView (Admin/Recruiter/Hiring Manager)
GET  /view-cv/:candidateId → ViewCV (Admin/Recruiter/Hiring Manager)
GET  /duplicates-admin    → DuplicateResolution (Admin/Recruiter - requires permission)
GET  /interviews          → InterviewManagement (Admin/Recruiter/Hiring Manager)
GET  /automation          → Automation (Admin only)
GET  /outcomes            → Outcomes (Admin/Recruiter/Hiring Manager)
GET  /actions             → Actions (Admin/Recruiter)
GET  /admin/settings      → Settings (Admin only)
```

---

## 2. RBAC Implementation

### User Roles

```typescript
type UserRole = 'admin' | 'recruiter' | 'hiring_manager' | 'candidate';
```

### Role Permissions Matrix

| Permission | Admin | Recruiter | Hiring Manager | Candidate |
|-----------|-------|-----------|----------------|-----------|
| canViewDashboard | ✅ | ✅ | ✅ | ❌ |
| canViewCandidates | ✅ | ✅ | ❌ | ❌ |
| canViewDuplicates | ✅ | ✅ | ❌ | ❌ |
| canMergeDuplicates | ✅ | ✅ | ❌ | ❌ |
| canManageInterviews | ✅ | ✅ | ✅ | ❌ |
| canViewReports | ✅ | ✅ | ✅ | ❌ |
| canManageTeam | ✅ | ❌ | ❌ | ❌ |

### Route Guards

**1. `RequireAuth`** - Basic authentication check
```typescript
<Route path="/dashboard" element={
  <RequireAuth>
    <Dashboard />
  </RequireAuth>
} />
```

**2. `RequireAdminRole`** - Admin-only access
```typescript
<Route path="/automation" element={
  <RequireAuth>
    <RequireAdminRole>
      <AutomationPage />
    </RequireAdminRole>
  </RequireAuth>
} />
```

**3. `RequireRecruiterOrAdmin`** - Admin OR Recruiter access
```typescript
<Route path="/duplicates-admin" element={
  <RequireAuth>
    <RequireRecruiterOrAdmin>
      <DuplicateResolution />
    </RequireRecruiterOrAdmin>
  </RequireAuth>
} />
```

**4. `RequirePermission`** - Granular permission check
```typescript
<Route path="/interviews" element={
  <RequireAuth>
    <RequireRecruiterOrAdmin>
      <RequirePermission requiredPermission="canManageInterviews">
        <InterviewManagement />
      </RequirePermission>
    </RequireRecruiterOrAdmin>
  </RequireAuth>
} />
```

---

## 3. Dynamic Skills Loading (Side Effects)

### Implementation in ProfileCreate.tsx

```typescript
// Side effect: Load skills when field changes
useEffect(() => {
  if (formData.interestedField) {
    const skills = getSkillsByField(formData.interestedField);
    setSuggestedSkills(skills);
    // Pre-select first 5 skills
    setSelectedSkills(skills.slice(0, 5));
  }
}, [formData.interestedField]);
```

### Skills Mapping (skillsService.ts)

```typescript
const FIELD_SKILLS_MAP: Record<FieldType, string[]> = {
  "Software Engineering": [
    "React.js", "TypeScript", "Node.js", "Docker", "AWS", ...
  ],
  "Data Science": [
    "Python", "Machine Learning", "TensorFlow", "Pandas", ...
  ],
  "Product Management": [
    "Product Strategy", "Roadmapping", "User Research", ...
  ],
  // ... more fields
};
```

### Usage
```typescript
// Get skills for a field
const skills = getSkillsByField("Software Engineering");

// Get all available fields
const allFields = getAllFields();
```

---

## 4. Smart Matching Logic

### Implementation Flow

**Step 1: Form Input Changes**
```typescript
// When user fills Name, DOB, or Phone - triggers smart match
useEffect(() => {
  const delayDebounceFn = setTimeout(async () => {
    if (formData.fullName || formData.phone || formData.dateOfBirth) {
      const result = await performSmartMatch(formData);
      setSmartMatchResult(result);
    }
  }, 1500); // Debounce for 1.5 seconds
}, [formData.fullName, formData.phone, formData.dateOfBirth]);
```

**Step 2: Smart Matching Service**
```typescript
// Performs database comparison
const result = await performSmartMatch({
  fullName: "John Doe",
  dateOfBirth: "1990-01-15",
  phone: "+1-555-123-4567"
});
```

### Match Result Structure

```typescript
interface SmartMatchResult {
  isDuplicate: boolean;                    // High confidence duplicate
  confidenceScore: number;                 // 0-100
  matchFields: {
    name: boolean;                         // Name matched
    dob: boolean;                          // DOB matched
    phone: boolean;                        // Phone matched
  };
  existingCandidate: any | null;           // Existing profile
  requiresReview: boolean;                 // Needs manual review
  message: string;                         // Human-readable message
  canProceedToSuccess: boolean;            // Can submit form
}
```

### Matching Algorithm

1. **Primary Check**: Email match (95% confidence)
2. **Secondary Check**: Phone match + Name similarity (70-90% confidence)
3. **Tertiary Check**: Name similarity (60-80% confidence)
4. **Result**: Block submission if isDuplicate=true or requiresReview=true

### Confidence Score Calculation

```typescript
const scoreWeights = {
  name: 0.4,      // 40% weight
  phone: 0.35,    // 35% weight
  dob: 0.25,      // 25% weight
};

// Example: If all 3 match
combinedScore = (0.4 * 100) + (0.35 * 100) + (0.25 * 100) = 100%
```

### Display in UI

```
✅ UNIQUE PROFILE (0%)
   Profile is unique. Ready to proceed. → canProceedToSuccess = true

⚠️ REVIEW NEEDED (75%)
   Potential duplicate found. Manual review recommended. → canProceedToSuccess = false

🔴 DUPLICATE (95%)
   This profile appears to be a duplicate. Please review. → canProceedToSuccess = false
```

---

## 5. Admin Dashboard RBAC

### AdminDashboardWrapper Component

Filters candidate data based on user role:

```typescript
const getFilteredCandidates = (): CandidateRecord[] => {
  if (!permissions.canViewCandidates) {
    return [];  // No access
  }

  if (role === "admin" || role === "recruiter") {
    return pipelineCandidates;  // Full access
  }

  if (role === "hiring_manager") {
    // Only their department
    return pipelineCandidates.filter(
      c => c.category === "Engineering" || c.category === "Product"
    );
  }

  return [];
};
```

### Feature Visibility

```typescript
const dashboardProps = {
  roleBasedFeatures: {
    canViewDuplicates: permissions.canViewDuplicates,
    canMergeDuplicates: permissions.canMergeDuplicates,
    canManageInterviews: permissions.canManageInterviews,
    canViewReports: permissions.canViewReports,
    canManageTeam: permissions.canManageTeam,
  }
};
```

---

## 6. Form Validation Flow

### ProfileCreate Validation

```typescript
const validateForm = (): boolean => {
  const newErrors: Record<string, string> = {};

  // Required fields
  if (!formData.fullName.trim()) {
    newErrors.fullName = "Full name is required";
  }
  
  if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    newErrors.email = "Invalid email format";
  }

  // Smart matching validation - CRITICAL
  if (smartMatchResult && smartMatchResult.isDuplicate) {
    newErrors.smartMatch = "Duplicate profile detected";
  }

  // Can only submit if smart matching passes
  if (!smartMatchResult?.canProceedToSuccess) {
    newErrors.submit = "Profile did not pass smart matching";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

---

## 7. Integration with Firebase

### User Role Storage (Firestore)

```typescript
// firestore: users/{uid}
{
  uid: "firebase-uid",
  email: "admin@example.com",
  role: "admin",      // admin | recruiter | hiring_manager | candidate
  department: "HR",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Custom Claims (Recommended for Production)

```typescript
// Firebase Auth custom claims
{
  uid: "firebase-uid",
  customClaims: {
    role: "admin",
    permissions: ["view_candidates", "merge_duplicates"]
  }
}
```

---

## 8. Usage Examples

### Example 1: Protect Admin-Only Route

```typescript
<Route
  path="/automation"
  element={
    <RequireAuth>
      <RequireAdminRole>
        <MainLayout>
          <AutomationPage />
        </MainLayout>
      </RequireAdminRole>
    </RequireAuth>
  }
/>
```

### Example 2: Dynamic Skills in ProfileCreate

When user selects "Software Engineering" field:
```
→ useEffect triggers
→ getSkillsByField("Software Engineering")
→ Returns: ["React.js", "TypeScript", "Node.js", "Docker", "AWS", ...]
→ Pre-select first 5 skills
→ User can toggle additional skills
```

### Example 3: Smart Matching Workflow

```
User enters: John Doe, DOB: 1990-01-15, Phone: +1-555-123-4567
                        ↓
        1.5 second debounce trigger
                        ↓
    performSmartMatch() queries database
                        ↓
    Match found: Email match (95% confidence)
                        ↓
    isDuplicate = true
    canProceedToSuccess = false
                        ↓
    UI shows red error banner:
    "🔴 DUPLICATE (95%)"
    "This profile appears to be a duplicate..."
                        ↓
    Submit button disabled
    User cannot proceed to success state
```

---

## 9. Testing Checklist

### Routing Tests
- [ ] Public routes accessible without auth
- [ ] Protected routes redirect to /signin
- [ ] Admin routes reject candidate users
- [ ] Recruiter routes allow both recruiter and admin

### Profile Creation Tests
- [ ] Skills load dynamically on field selection
- [ ] Smart matching triggers after form delays 1.5s
- [ ] Duplicate detection blocks form submission
- [ ] Form submits successfully when unique
- [ ] CV upload validation works

### RBAC Tests
- [ ] Admin sees all dashboard data
- [ ] Recruiter sees all candidates
- [ ] Hiring Manager sees only their department
- [ ] Candidate sees access denied message
- [ ] Permission-based features show/hide correctly

### Smart Matching Tests
- [ ] Name similarity calculation accurate
- [ ] Phone normalization works
- [ ] DOB comparison works
- [ ] Confidence score calculation correct
- [ ] UI displays correct status badge

---

## 10. Troubleshooting

### Issue: Role always returns 'candidate'
**Solution**: Ensure RBACContext is wrapped in App.tsx and user role is fetched from Firestore

### Issue: Skills don't load
**Solution**: Verify getAllFields() returns correct array and useEffect dependency is [formData.interestedField]

### Issue: Smart matching never triggers
**Solution**: Check debounce timer (1500ms), verify performSmartMatch is async, check console for errors

### Issue: RBAC guards not working
**Solution**: Verify RequireAuth is wrapping route, useRBAC hook is called within RBACProvider

---

## 11. Future Enhancements

- [ ] Implement custom Firebase claims for serverside RBAC
- [ ] Add role-based API access tokens
- [ ] Create admin UI for role assignment
- [ ] Add activity logging for audit trail
- [ ] Implement skill endorsements from colleagues
- [ ] Add ML-based duplicate detection
- [ ] Create admin reports dashboard
- [ ] Add team collaboration features

---

## Files Created/Modified

### New Files
✅ `RBACContext.tsx` - Role/Permission management
✅ `RouteGuards.tsx` - RBAC route protection components
✅ `skillsService.ts` - Dynamic skills lookup
✅ `smartMatchingService.ts` - Smart matching logic
✅ `AdminDashboardWrapper.tsx` - RBAC-aware dashboard wrapper

### Modified Files
✅ `ProfileCreate.tsx` - Enhanced with smart matching & skills loading
✅ `AppRoutes.tsx` - Integrated RBAC guards
✅ `useAuth.ts` - (Recommended: extend with RBAC)

### Files to Create (Optional)
⚠️ `useRBAC.ts` - Custom hook wrapper for RBACContext
⚠️ `rbacMiddleware.ts` - Server-side RBAC for API calls
