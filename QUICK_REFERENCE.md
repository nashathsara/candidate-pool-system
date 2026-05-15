# Quick Reference Guide

## 🚀 Getting Started

### 1. Protect a Route with Auth Only

```typescript
<Route
  path="/browse"
  element={
    <RequireAuth>
      <BrowseJobs />
    </RequireAuth>
  }
/>
```

### 2. Protect a Route for Admin Only

```typescript
<Route
  path="/automation"
  element={
    <RequireAuth>
      <RequireAdminRole>
        <AutomationPage />
      </RequireAdminRole>
    </RequireAuth>
  }
/>
```

### 3. Protect a Route for Recruiter or Admin

```typescript
<Route
  path="/duplicates-admin"
  element={
    <RequireAuth>
      <RequireRecruiterOrAdmin>
        <DuplicateResolution />
      </RequireRecruiterOrAdmin>
    </RequireAuth>
  }
/>
```

### 4. Protect by Specific Permission

```typescript
<Route
  path="/interviews"
  element={
    <RequireAuth>
      <RequireRecruiterOrAdmin>
        <RequirePermission requiredPermission="canManageInterviews">
          <InterviewManagement />
        </RequirePermission>
      </RequireRecruiterOrAdmin>
    </RequireAuth>
  }
/>
```

---

## 🎯 Using Skills Service

### Get Skills for a Field

```typescript
import { getSkillsByField } from '../services/skillsService';

const skills = getSkillsByField('Software Engineering');
// Returns: ["React.js", "TypeScript", "Node.js", "Docker", "AWS", ...]
```

### Get All Available Fields

```typescript
import { getAllFields } from '../services/skillsService';

const fields = getAllFields();
// Returns: ["Software Engineering", "Data Science", "Product Management", ...]
```

### Calculate Skill Match Percentage

```typescript
import { calculateSkillMatch } from '../services/skillsService';

const candidateSkills = ["React.js", "Node.js", "Docker"];
const jobSkills = ["React.js", "TypeScript", "Node.js"];

const matchPercentage = calculateSkillMatch(candidateSkills, jobSkills);
// Returns: 67 (2 out of 3 job skills matched)
```

---

## 🔍 Using Smart Matching Service

### Perform Smart Match

```typescript
import { performSmartMatch } from '../services/smartMatchingService';

const result = await performSmartMatch({
  fullName: "John Doe",
  dateOfBirth: "1990-01-15",
  phone: "+1-555-123-4567",
  email: "john@example.com"
});

// Result structure:
// {
//   isDuplicate: false,
//   confidenceScore: 0,
//   matchFields: { name: false, dob: false, phone: false },
//   existingCandidate: null,
//   requiresReview: false,
//   message: "✅ No duplicates found...",
//   canProceedToSuccess: true
// }
```

### Validate Candidate Data

```typescript
import { validateCandidateForMatching } from '../services/smartMatchingService';

const validation = validateCandidateForMatching({
  fullName: "John",
  phone: "+1-555-123"
});

if (!validation.isValid) {
  console.log('Errors:', validation.errors);
  // Errors: ["Full name must be at least 2 characters", ...]
}
```

### Format Result for UI

```typescript
import { formatSmartMatchResult } from '../services/smartMatchingService';

const formatted = formatSmartMatchResult(smartMatchResult);

// Returns:
// {
//   statusBadge: "UNIQUE PROFILE",
//   statusColor: "success",
//   actionText: "✅ Profile is unique. Ready to proceed.",
//   canProceed: true
// }
```

---

## 🔐 Using RBAC Context

### In a Component

```typescript
import { useRBAC } from '../contexts/RBACContext';

export const MyComponent = () => {
  const { user, role, permissions, loading } = useRBAC();

  if (loading) return <div>Loading...</div>;

  if (role === 'admin') {
    return <AdminPanel />;
  }

  if (permissions.canViewDashboard) {
    return <Dashboard />;
  }

  return <AccessDenied />;
};
```

### Check Specific Permission

```typescript
import { usePermission } from '../contexts/RBACContext';

export const DuplicateButton = () => {
  const canMergeDuplicates = usePermission('canMergeDuplicates');

  if (!canMergeDuplicates) {
    return null;  // Don't show button
  }

  return <button>Merge Duplicates</button>;
};
```

### Get User Role

```typescript
import { useRBAC } from '../contexts/RBACContext';

export const RoleDisplay = () => {
  const { role } = useRBAC();

  return <div>Your role: {role || 'Not set'}</div>;
};
```

---

## 📋 Role-Based Feature Checklist

### Admin Features
- [x] View all candidates
- [x] View duplicates
- [x] Merge duplicates
- [x] Manage interviews
- [x] View reports
- [x] Manage team
- [x] Automation settings

### Recruiter Features
- [x] View all candidates
- [x] View duplicates
- [x] Merge duplicates
- [x] Manage interviews
- [x] View reports
- [ ] Manage team
- [ ] Automation settings

### Hiring Manager Features
- [ ] View all candidates (only their department)
- [ ] View duplicates
- [ ] Merge duplicates
- [x] Manage interviews
- [x] View reports
- [ ] Manage team
- [ ] Automation settings

### Candidate Features
- [ ] View all candidates
- [ ] View duplicates
- [ ] Merge duplicates
- [ ] Manage interviews
- [ ] View reports
- [ ] Manage team
- [ ] Automation settings

---

## 🔧 Common Tasks

### Task 1: Add a New Admin-Only Page

```typescript
// 1. Create the page component
export const NewAdminPage = () => {
  return <div>Admin Content</div>;
};

// 2. Add to AppRoutes.tsx
import NewAdminPage from "./pages/Admin/NewAdminPage";

// In Routes:
<Route
  path="/admin/new-page"
  element={
    <RequireAuth>
      <RequireAdminRole>
        <MainLayout>
          <NewAdminPage />
        </MainLayout>
      </RequireAdminRole>
    </RequireAuth>
  }
/>

// 3. Add to navigation (MainLayout.tsx)
const navItems = [
  // ... existing items
  { name: "New Admin Page", path: "/admin/new-page", icon: <IconComponent /> }
];
```

### Task 2: Add a New Field to Skills Map

```typescript
// In skillsService.ts, add to FIELD_SKILLS_MAP:

const FIELD_SKILLS_MAP: Record<FieldType, string[]> = {
  // ... existing fields
  
  "Mobile Development": [
    "React Native",
    "Swift",
    "Kotlin",
    "Flutter",
    "Firebase",
    "Mobile UI",
    "iOS Development",
    "Android Development",
    "App Store",
    "Cross-platform"
  ]
};

// Also update FieldType:
export type FieldType = 
  | "Software Engineering"
  | "Data Science"
  | "Product Management"
  | "Design"
  | "Cybersecurity"
  | "Infrastructure Engineering"
  | "Mobile Development";  // ← Add here
```

### Task 3: Add a New Permission

```typescript
// In RBACContext.tsx

export interface UserPermissions {
  // ... existing permissions
  canPublishCandidates: boolean;  // ← Add new
}

// Update role permissions:
const ROLE_PERMISSIONS: Record<UserRole, UserPermissions> = {
  admin: {
    // ... existing
    canPublishCandidates: true
  },
  recruiter: {
    // ... existing
    canPublishCandidates: true
  },
  hiring_manager: {
    // ... existing
    canPublishCandidates: false
  },
  candidate: {
    // ... existing
    canPublishCandidates: false
  }
};

// Use in component:
const canPublish = usePermission('canPublishCandidates');
```

### Task 4: Manually Trigger Smart Matching

```typescript
import { performSmartMatch, formatSmartMatchResult } from '../services/smartMatchingService';

export const ManualMatchCheck = () => {
  const [result, setResult] = useState(null);

  const checkMatch = async () => {
    const matchResult = await performSmartMatch({
      fullName: "John Doe",
      phone: "+1-555-123-4567"
    });
    
    const formatted = formatSmartMatchResult(matchResult);
    setResult(formatted);
  };

  return (
    <div>
      <button onClick={checkMatch}>Check for Duplicates</button>
      {result && (
        <div className={`status-banner status-banner--${result.statusColor}`}>
          {result.statusBadge}
        </div>
      )}
    </div>
  );
};
```

---

## 🐛 Debugging Tips

### Check User Role

```typescript
import { useRBAC } from '../contexts/RBACContext';

// In browser console:
// 1. Add this to any component
const { role, permissions } = useRBAC();
console.log('User role:', role);
console.log('Permissions:', permissions);

// 2. Or check in Redux/Context DevTools
```

### Check Smart Match Result

```typescript
// In ProfileCreate component
console.log('Smart match result:', smartMatchResult);
console.log('Can proceed:', smartMatchResult?.canProceedToSuccess);
console.log('Matched fields:', smartMatchResult?.matchFields);
```

### Test Skills Loading

```typescript
// In browser console
import { getSkillsByField, getAllFields } from './services/skillsService';

console.log('All fields:', getAllFields());
console.log('Skills for SE:', getSkillsByField('Software Engineering'));
```

### Verify Route Guards

```typescript
// Navigate to protected route and check:
// 1. Are you logged in? Check useAuth()
// 2. What's your role? Check useRBAC()
// 3. Do you have permission? Check usePermission()
```

---

## 📚 File Reference

| File | Purpose | Key Exports |
|------|---------|-------------|
| `RBACContext.tsx` | Role management | `useRBAC`, `usePermission`, `RBACProvider` |
| `RouteGuards.tsx` | Route protection | `RequireAuth`, `RequireAdminRole`, `RequirePermission` |
| `skillsService.ts` | Skills lookup | `getSkillsByField`, `getAllFields`, `calculateSkillMatch` |
| `smartMatchingService.ts` | Duplicate detection | `performSmartMatch`, `validateCandidateForMatching`, `formatSmartMatchResult` |
| `ProfileCreate.tsx` | Profile form | Smart matching + Dynamic skills |
| `AdminDashboardWrapper.tsx` | RBAC dashboard | Role-based data filtering |

---

## ❓ FAQ

**Q: How do I add a new admin user?**
A: Create a user document in Firestore at `users/{uid}` with `role: 'admin'`

**Q: How often does smart matching run?**
A: Every 1.5 seconds after user stops typing (debounced)

**Q: Can hiring managers see candidates from other departments?**
A: No, they only see candidates in their department category

**Q: What happens if smart matching fails?**
A: Error is caught, logged to console, and user sees "Check for duplicates..." message indefinitely

**Q: Can I customize the confidence score threshold?**
A: Yes, modify the weights in `smartMatchingService.ts` in the `generateMatchMessage()` function

**Q: How do I test RBAC locally?**
A: Create test users in Firebase with different roles, then sign in with each role and check access

**Q: Are skills editable by users?**
A: Yes, they can toggle skills on/off in the ProfileCreate form

**Q: What data is stored after smart matching?**
A: The entire `SmartMatchResult` object is stored in candidate metadata in Firestore
