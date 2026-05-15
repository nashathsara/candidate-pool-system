# Candidate Pool System - Routing Architecture

## Overview

The application routing is organized into 5 logical sections matching the documented user flows:
1. **Public Routes** - Accessible without authentication
2. **Candidate Flow** - For verified candidates applying to jobs
3. **Admin Flow** - For administrators managing the system
4. **Deprecated Routes** - Legacy path redirects to current paths
5. **404 Fallback** - Catches all unmatched routes

---

## 1. PUBLIC ROUTES

**File:** `frontend/src/AppRoutes.tsx`

### Landing Pages
- `GET /` → Home page (job listing landing)
- `GET /home` → Home page alias

### Authentication Pages
- `GET /signin` → Sign in with email/password
- `GET /signup` → Create new candidate account
- `GET /EmailVerification` → Email verification flow
- `GET /verified` → Verification success confirmation

**No authentication required**. These pages redirect to signin if accessed by non-authenticated users or home page if already authenticated.

---

## 2. CANDIDATE FLOW

Protected routes requiring user authentication via `RequireAuth` guard component.

### Profile Setup Phase
```
GET /profile/create
  - Component: ProfileCreate
  - Purpose: Create initial candidate profile during signup
  - Auth: RequireAuth wrapper
  - Navigation: → /candidate-dashboard (after profile complete)
```

### Job Application Phase
```
GET /browse
  - Component: BrowseJobs
  - Purpose: List available job openings
  - Auth: RequireAuth wrapper
  - Navigation: → /applications (to view submitted applications)

GET /applications
  - Component: Applications
  - Purpose: View previously submitted applications
  - Auth: RequireAuth wrapper
  - Navigation: → /candidate-dashboard (back to main)

POST /application-success/:jobId
  - Component: ApplicationSuccess
  - Purpose: Confirmation page after successful job application
  - Params: jobId = Job ID applied for
  - Navigation: → /browse (to apply to more jobs)
```

### Dashboard & Account Management
```
GET /candidate-dashboard
  - Component: CandidateDashboard
  - Purpose: Main candidate control panel
  - Auth: RequireAuth wrapper
  - Navigation: → /browse, /applications, /settings, /help, /support

GET /profile-merge
  - Component: ProfileMerge
  - Purpose: Merge duplicate accounts
  - Auth: RequireAuth wrapper
  - Navigation: → /candidate-dashboard (after merge)

GET /settings
  - Component: CandidateSettings (CandidateSettingsPage)
  - Purpose: Account settings, profile management
  - Auth: RequireAuth wrapper
  - Navigation: → /candidate-dashboard (back to main)

GET /help
  - Component: HelpCenter
  - Purpose: FAQ and support resources
  - Auth: RequireAuth wrapper
  - Navigation: → /candidate-dashboard (back to main)

GET /support
  - Component: TicketSubmitForm
  - Purpose: Submit support tickets/issues
  - Auth: RequireAuth wrapper
  - Navigation: → /ticket-success (after submission)

GET /ticket-success
  - Component: TicketSuccess
  - Purpose: Confirmation after ticket submission
  - Navigation: → /candidate-dashboard (back to main)
```

---

## 3. ADMIN FLOW

Protected routes for administrators. All wrapped in:
1. `RequireAuth` guard component (authentication check)
2. `MainLayout` wrapper (admin navigation, sidebar, header)

### Admin Dashboard & Analytics
```
GET /dashboard
  - Component: MainLayout + AdminDashboardPage
  - Purpose: Admin dashboard with analytics and overview
  - Layout: Admin sidebar + main header
  - Navigation: → /candidates, /duplicates-admin, /admin/settings
```

### Candidate Management
```
GET /candidates
  - Component: MainLayout + Candidates
  - Purpose: List all candidates in the system
  - Layout: Admin sidebar + main header
  - Navigation: → /candidate-profile/:id (view specific candidate)

GET /candidate-profile/:id
  - Component: MainLayout + ProfileView
  - Purpose: Detailed view of specific candidate profile
  - Params: id = Candidate ID
  - Layout: Admin sidebar + main header
  - Navigation: → /view-cv/:candidateId (view CV), → /duplicates-admin (merge duplicates)
```

### Document Review
```
GET /view-cv/:candidateId
  - Component: MainLayout + ViewCV (ViewCVWrapper)
  - Purpose: View candidate's uploaded CV/resume
  - Params: candidateId = Candidate ID
  - Layout: Admin sidebar + main header
  - Navigation: → /candidate-profile/:id (back to profile)
```

### Duplicate Resolution
```
GET /duplicates-admin
  - Component: MainLayout + DuplicateResolution
  - Purpose: Review and merge detected duplicate candidate accounts
  - Layout: Admin sidebar + main header
  - Navigation: → /candidate-profile/:id (view candidates), → /dashboard (back)
```

### Admin Settings
```
GET /admin/settings
  - Component: Settings
  - Purpose: System settings and configuration
  - Auth: RequireAuth wrapper (no MainLayout)
  - Navigation: → /dashboard (back to main)
```

---

## 4. DEPRECATED/LEGACY ROUTES

Redirect old route names to new canonical paths to maintain backward compatibility:

- `/BrowseJobs` → `/browse` (case-insensitive alias)
- `/browse-jobs` → `/browse` (hyphenated variant)
- `/jobs` → `/browse` (shorter alias)
- `/profile` → `/candidate-dashboard` (old naming)
- `/application-success` → `/browse` (parameterless version)

**Legacy Candidate Pages:**
```
GET /profile-cancel
  - Component: ProfileCancel
  - Purpose: Cancel candidate account
  - Auth: RequireAuth wrapper
  - Navigation: → /home (after cancellation, logged out)
```

---

## 5. 404 FALLBACK

```
GET * (any unmatched path)
  - Redirects to: / (home page)
  - Replaces history to prevent back-button issues
```

---

## Route Organization Table

| Section | Path | Component | Auth | Layout | Purpose |
|---------|------|-----------|------|--------|---------|
| **PUBLIC** | / | Home | No | None | Job listings |
| | /signin | SignIn | No | None | Login page |
| | /signup | Signup | No | None | Registration |
| | /EmailVerification | EmailVerification | No | None | Email verification flow |
| | /verified | VerificationSuccess | No | None | Verification confirmation |
| **CANDIDATE** | /profile/create | ProfileCreate | Yes | None | Create profile |
| | /browse | BrowseJobs | Yes | None | Browse jobs |
| | /applications | Applications | Yes | None | My applications |
| | /application-success/:jobId | ApplicationSuccess | No | None | Application confirmation |
| | /candidate-dashboard | CandidateDashboard | Yes | None | Main dashboard |
| | /profile-merge | ProfileMerge | Yes | None | Merge accounts |
| | /settings | CandidateSettings | Yes | None | Account settings |
| | /help | HelpCenter | Yes | None | Help center |
| | /support | TicketSubmitForm | Yes | None | Submit support ticket |
| | /ticket-success | TicketSuccess | No | None | Ticket confirmation |
| **ADMIN** | /dashboard | AdminDashboardPage | Yes | MainLayout | Admin overview |
| | /candidates | Candidates | Yes | MainLayout | Candidate list |
| | /candidate-profile/:id | ProfileView | Yes | MainLayout | Candidate details |
| | /view-cv/:candidateId | ViewCV | Yes | MainLayout | View resume |
| | /duplicates-admin | DuplicateResolution | Yes | MainLayout | Duplicate management |
| | /admin/settings | Settings | Yes | None | Admin settings |
| **LEGACY** | /profile-cancel | ProfileCancel | Yes | None | Cancel account |

---

## Authentication & Authorization

### RequireAuth Guard Component

Located in `frontend/src/AppRoutes.tsx`, the `RequireAuth` component:

1. Checks `isSignedIn` flag from `useAuth()` hook
2. If not authenticated, redirects to `/signin` with location state
3. If loading, returns null (preserves state during auth check)
4. If authenticated, renders the protected component

```typescript
const RequireAuth = ({ children }: { children: React.ReactElement }) => {
  const { isSignedIn, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return null;
  }

  if (!isSignedIn) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  return children;
};
```

### useAuth() Hook

Located in `frontend/src/hooks/useAuth.ts`, returns:
- `user` - Firebase user object
- `loading` - Boolean indicating if auth state is being verified
- `isSignedIn` - Boolean indicating if user is authenticated

---

## Navigation Flows

### Complete Candidate Journey

```
Home (/)
  ↓
Signup (/signup)
  ↓
Email Verification (/EmailVerification)
  ↓
Verification Success (/verified)
  ↓
Sign In (/signin)
  ↓
Profile Create (/profile/create)
  ↓
Candidate Dashboard (/candidate-dashboard)
  ├→ Browse Jobs (/browse)
  │   ↓
  │   Application Success (/application-success/:jobId)
  │   ↓
  │   Back to Browse
  │
  ├→ View Applications (/applications)
  │
  ├→ Merge Duplicate Profile (/profile-merge)
  │
  ├→ Account Settings (/settings)
  │
  ├→ Help Center (/help)
  │
  └→ Submit Support Ticket (/support)
       ↓
       Ticket Success (/ticket-success)
```

### Complete Admin Journey

```
Sign In (/signin)
  ↓
Admin Dashboard (/dashboard)
  ├→ Candidates (/candidates)
  │   ↓
  │   Candidate Profile (/candidate-profile/:id)
  │   ├→ View CV (/view-cv/:candidateId)
  │   └→ Manage Duplicates (/duplicates-admin)
  │
  ├→ Duplicate Resolution (/duplicates-admin)
  │
  └→ Admin Settings (/admin/settings)
```

---

## Sign-Out & Back-Button Security

### Implementation Details

**Sign-Out Flow:**
1. User clicks "Sign Out" button anywhere in app
2. Firebase `signOut(auth)` called to clear authentication
3. `navigate('/', { replace: true })` redirects to home with history replacement
4. History entry is replaced (not pushed) to prevent back-button access

**Protected Route Access:**
- All protected routes use `{ replace: true }` in navigation to prevent stack buildup
- Browser back button cannot return to protected pages after logout
- If user attempts back-button to protected route, `RequireAuth` redirects to `/signin`

**Implementation in Routes:**
- All `<RequireAuth>` protected routes prevent unauthenticated access
- Sign-out handlers use `navigate(path, { replace: true })` instead of `navigate(path)`
- Public pages accessible regardless of auth state

---

## Key Architectural Principles

1. **Clear Role Separation** - Candidate and Admin flows are completely separate
2. **Consistent Authentication** - All protected routes wrapped with `RequireAuth`
3. **History Safety** - All navigations use `replace: true` after logout
4. **Backward Compatibility** - Legacy route names redirect to new canonical paths
5. **Responsive Layouts** - Candidate pages standalone, Admin pages wrapped with MainLayout
6. **Clear Purpose** - Each route has explicit semantic meaning
7. **Type Safety** - URL params extracted with React Router's `useParams<>()`

---

## Validation Checklist

- [x] All public routes accessible without login
- [x] All candidate routes protected with RequireAuth
- [x] All admin routes protected with RequireAuth + MainLayout
- [x] Sign-in redirects to /candidate-dashboard (not /settings)
- [x] Sign-out redirects to / (home, not /signin)
- [x] Back-button prevented after logout with `replace: true`
- [x] Legacy routes redirect to canonical paths
- [x] 404 routes redirect to home
- [x] TypeScript build passes without errors
- [x] Vite build completes successfully (1864 modules)
