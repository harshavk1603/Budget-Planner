# BudgetPro — Project Report Outline

> Use this outline to quickly assemble a college project report or presentation.
> Each section includes what to write and where to find the relevant code.

---

## Title

**BudgetPro: A Full-Stack Personal Finance Tracker Using React and Supabase**

---

## Abstract

BudgetPro is a web-based personal finance management application that enables users to track income and expenses, set category-level budget limits, create and fund savings goals, and visualize financial data through interactive charts. The application is built with React 19 on the frontend and Supabase (PostgreSQL + Auth + Row-Level Security) on the backend, eliminating the need for a custom API server. The system provides four main modules — authentication, transaction management, savings goal tracking, and budget monitoring — with a responsive dark/light theme UI. All user data is isolated through database-level Row-Level Security policies, ensuring privacy without application-level access control logic. The project demonstrates practical application of full-stack web development, database design, and modern frontend architecture.

---

## 1. Problem Statement

Personal finance management is essential for financial health, yet existing solutions are often:

- **Subscription-based** — requiring monthly payments for basic features
- **Overly complex** — bloated with features most users never need
- **Privacy-concerning** — storing sensitive financial data on third-party servers without transparency
- **Platform-locked** — available only on mobile or only on desktop

There is a need for a free, open, lightweight, and privacy-conscious personal finance tracker that users can self-host or deploy with minimal configuration, while still providing professional-grade features like interactive analytics, budget alerts, and multi-currency support.

---

## 2. Objectives

1. Build a responsive personal finance web application with full CRUD operations for income, expenses, savings goals, and budget limits.
2. Implement secure user authentication and data isolation using Supabase Auth and Row-Level Security.
3. Design a normalized PostgreSQL schema supporting multi-user financial data with per-user budget constraints.
4. Create interactive data visualizations (pie charts, bar charts, area charts) for financial analytics.
5. Deliver a polished user experience with dark/light theme, multi-currency formatting, empty states, and mobile responsiveness.
6. Minimize backend complexity by leveraging Supabase as a Backend-as-a-Service (BaaS) platform.

---

## 3. System Architecture

### 3.1 High-Level Architecture

```
┌──────────────────────────────────────────────────────┐
│                   Client (Browser)                    │
│                                                       │
│  ┌───────────┐  ┌───────────┐  ┌──────────────────┐  │
│  │ Dashboard  │  │ Expense   │  │    Reports &     │  │
│  │   Page     │  │ Tracker   │  │    Analytics     │  │
│  └─────┬─────┘  └─────┬─────┘  └────────┬─────────┘  │
│        └──────────────┼──────────────────┘            │
│                       ▼                               │
│  ┌─────────────────────────────────────────────────┐  │
│  │           AppProvider (React Context)            │  │
│  │   Global state, auth listener, CRUD methods      │  │
│  └──────────────────────┬──────────────────────────┘  │
│                         ▼                             │
│  ┌─────────────────────────────────────────────────┐  │
│  │              Service Layer                       │  │
│  │  authService │ transactionService               │  │
│  │  savingsService │ budgetService                  │  │
│  └──────────────────────┬──────────────────────────┘  │
└─────────────────────────┼────────────────────────────┘
                          ▼
┌──────────────────────────────────────────────────────┐
│                Supabase Backend                       │
│  ┌──────────┐  ┌────────────┐  ┌──────────────────┐  │
│  │  Auth     │  │ PostgreSQL │  │   Row-Level      │  │
│  │  Service  │  │ 4 Tables   │  │   Security       │  │
│  └──────────┘  └────────────┘  └──────────────────┘  │
└──────────────────────────────────────────────────────┘
```

### 3.2 Component Architecture

| Component | File | Responsibility |
|-----------|------|---------------|
| `App` | `src/App.jsx` | Root routing, protected routes |
| `AppProvider` | `src/context/AppProvider.jsx` | Global state, auth, CRUD orchestration |
| `Layout` | `src/components/Layout.jsx` | Sidebar navigation + topbar shell |
| `LoginPage` | `src/pages/LoginPage.jsx` | Authentication with hero panel |
| `DashboardPage` | `src/pages/DashboardPage.jsx` | Financial overview, income, savings, alerts |
| `ExpenseTrackerPage` | `src/pages/ExpenseTrackerPage.jsx` | Expense CRUD, filters, budget limits |
| `ReportsPage` | `src/pages/ReportsPage.jsx` | Charts, analytics, monthly summary |
| `StatCard` | `src/components/StatCard.jsx` | Reusable dashboard metric card |

### 3.3 Data Flow

1. User authenticates via Supabase Auth → JWT session stored in browser
2. `AppProvider` initializes by fetching session, profile, and all user data via `Promise.all`
3. Pages consume context via `useApp()` hook, call service methods for mutations
4. Services use Supabase JS SDK to query PostgreSQL — RLS ensures data isolation
5. UI updates reactively as context state changes

---

## 4. Module Descriptions

### Module 1: Authentication & User Management

- **Files:** `authService.js`, `LoginPage.jsx`, `AppProvider.jsx`
- **Functionality:** Email/password sign-up with username, login, logout, session persistence, auto-profile creation
- **Key Implementation:** `onAuthStateChange` listener handles session refresh and data loading on page reload

### Module 2: Transaction Management

- **Files:** `transactionService.js`, `DashboardPage.jsx`, `ExpenseTrackerPage.jsx`
- **Functionality:** Full CRUD for income and expense transactions, search, filter by category/month, sort by date/amount
- **Key Implementation:** Income stored as `type: "income"` with `category: "income"`, expenses use one of 7 predefined categories

### Module 3: Savings Goal Tracking

- **Files:** `savingsService.js`, `DashboardPage.jsx`
- **Functionality:** Create goals with emoji icons and target amounts, deposit funds, visual progress bars, delete goals
- **Key Implementation:** Deposit logic caps saved amount at target (`savingsService.deposit()`)

### Module 4: Budget Limit Management

- **Files:** `budgetService.js`, `ExpenseTrackerPage.jsx`, `DashboardPage.jsx`
- **Functionality:** Set spending limits per category per month, progress bars showing spend vs limit, budget alerts when overspending
- **Key Implementation:** Unique constraint on `(user_id, category, month)` with Supabase `upsert`

### Module 5: Reports & Analytics

- **Files:** `ReportsPage.jsx`
- **Functionality:** Pie chart (category breakdown), bar chart (income vs expenses), area chart (6-month trends), monthly summary table with savings rate
- **Key Implementation:** All charts derived from same transaction state using `useMemo` for performance

### Module 6: UI/UX System

- **Files:** `index.css`, `Layout.jsx`, component CSS files
- **Functionality:** Dark/light theme, multi-currency formatting, responsive layout, empty/loading/error states
- **Key Implementation:** 874-line CSS custom property design system, `data-theme` attribute toggle

---

## 5. Database Schema

### 5.1 Entity-Relationship Diagram

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   profiles    │     │   transactions    │     │  savings_goals   │
├──────────────┤     ├──────────────────┤     ├──────────────────┤
│ id (PK, UUID)│◄──┐ │ id (PK, UUID)    │     │ id (PK, UUID)    │
│ username      │   │ │ user_id (FK) ────┤──┐  │ user_id (FK) ────┤──┐
│ created_at    │   │ │ type             │  │  │ name             │  │
└──────────────┘   │ │ amount           │  │  │ target           │  │
                    │ │ category         │  │  │ saved            │  │
                    │ │ description      │  │  │ emoji            │  │
                    │ │ date             │  │  │ deadline         │  │
                    │ │ note             │  │  │ created_at       │  │
                    │ │ created_at       │  │  └──────────────────┘  │
                    │ └──────────────────┘  │                        │
                    │                       │  ┌──────────────────┐  │
                    │                       │  │     budgets       │  │
                    │                       │  ├──────────────────┤  │
                    │                       │  │ id (PK, UUID)    │  │
                    └───────────────────────┤  │ user_id (FK) ────┘  │
                                            │  │ category         │
                                            │  │ limit_amount     │
                                            │  │ month (YYYY-MM)  │
                                            │  │ created_at       │
                                            │  │ UNIQUE(user,cat, │
                                            │  │       month)     │
                                            │  └──────────────────┘
                                            │
                                     auth.users (Supabase Auth)
```

### 5.2 Table Descriptions

| Table | Purpose | Key Constraints |
|-------|---------|----------------|
| `profiles` | User profile with username | PK = `auth.users.id`, unique username |
| `transactions` | Income + expense records | `type` check constraint (`income`/`expense`), indexed on `user_id` + `date` |
| `savings_goals` | Savings targets with progress | `target > 0`, `saved >= 0`, indexed on `user_id` |
| `budgets` | Monthly category budget limits | Unique on `(user_id, category, month)`, `limit_amount > 0` |

### 5.3 Row-Level Security

Every table has RLS enabled with policies ensuring `auth.uid() = user_id` for SELECT, INSERT, UPDATE, and DELETE operations. This means:
- Users can only read their own data
- Users can only insert data for themselves
- Users can only update/delete their own records
- No application-level access control is needed — the database enforces isolation

---

## 6. Implementation

### 6.1 Technology Choices

| Choice | Technology | Justification |
|--------|-----------|---------------|
| Frontend Framework | React 19 | Component-based architecture, hooks, context API |
| Build Tool | Vite 8 | Fast HMR, optimized builds, ESM-native |
| Routing | React Router v7 | Client-side routing for SPA |
| Backend | Supabase | BaaS with Postgres, Auth, RLS — no custom API needed |
| Charts | Recharts 3 | Declarative React chart components |
| Styling | CSS Custom Properties | Zero-runtime theming, design token system |
| Linting | ESLint 10 | Code quality enforcement |

### 6.2 Key Implementation Details

**Service Layer Pattern:**
Each Supabase table has a dedicated service file (`authService.js`, `transactionService.js`, `savingsService.js`, `budgetService.js`) that encapsulates all database queries. This keeps the context provider and UI components clean.

**State Management:**
React Context (`AppProvider`) manages all global state. `useMemo` is used for derived data (filtered lists, totals, charts). `useCallback` is used for fetch functions to prevent unnecessary re-renders.

**Theme System:**
A `data-theme` attribute on `<html>` switches between dark and light modes. All colors, backgrounds, and borders reference CSS custom properties that change based on this attribute. No JavaScript runtime is involved in theme switching.

**Budget Limit Upsert:**
The `budgets` table has a unique constraint on `(user_id, category, month)`. The `budgetService.upsert()` method uses Supabase's `upsert` with `onConflict` to handle both insert and update in a single call.

---

## 7. Testing

### 7.1 Functional Testing

| Test Case | Expected Result | Status |
|-----------|----------------|--------|
| Sign up with valid credentials | Account created, redirected to dashboard | Pass |
| Sign up with existing email | Error message displayed | Pass |
| Login with valid credentials | Session restored, dashboard loads | Pass |
| Login with invalid credentials | Error message displayed | Pass |
| Session restore on page refresh | User remains logged in | Pass |
| Add income transaction | Appears in dashboard, totals update | Pass |
| Add expense transaction | Appears in tracker, charts update | Pass |
| Edit transaction | Updated in database and UI | Pass |
| Delete transaction | Removed from database and UI | Pass |
| Create savings goal | Appears with progress bar | Pass |
| Deposit to savings goal | Progress bar updates, capped at target | Pass |
| Set budget limits | Saved to database, progress bars appear | Pass |
| Budget alert trigger | Red alert card when spending exceeds limit | Pass |
| Search expenses | Filtered results match query | Pass |
| Filter by category | Only matching expenses shown | Pass |
| Filter by month | Only matching expenses shown | Pass |
| Theme toggle | Dark/light mode switches correctly | Pass |
| Currency switch | All values reformat with new currency | Pass |
| Empty state display | Friendly messages when no data exists | Pass |
| Mobile responsive | Sidebar collapses, layout adapts | Pass |

### 7.2 Security Testing

| Test Case | Expected Result | Status |
|-----------|----------------|--------|
| User A cannot see User B's transactions | RLS blocks cross-user queries | Pass |
| Unauthenticated access to /dashboard | Redirected to /login | Pass |
| SQL injection via search input | Supabase parameterized queries prevent injection | Pass |

---

## 8. Results & Screenshots

> Add screenshots of the running application here.

| Page | Screenshot |
|------|-----------|
| Login Page | `docs/screenshots/login.png` |
| Dashboard | `docs/screenshots/dashboard.png` |
| Expense Tracker | `docs/screenshots/expenses.png` |
| Reports & Analytics | `docs/screenshots/reports.png` |

---

## 9. Conclusion

BudgetPro demonstrates that a full-stack personal finance application can be built with a modern frontend framework and a Backend-as-a-Service platform, eliminating the need for a custom API server while maintaining robust security through database-level Row-Level Security. The application provides comprehensive financial management features — income/expense tracking, budget monitoring, savings goal management, and interactive analytics — in a polished, responsive interface.

Key technical achievements include:
- **Zero custom backend code** — Supabase handles auth, database, and security
- **Database-enforced data privacy** — RLS policies ensure complete user isolation
- **Reactive UI** — Context-driven state management with instant updates after mutations
- **Comprehensive UX** — Loading, empty, error, and edge-case states handled across all pages
- **Design system** — 874-line CSS token system enabling instant theme switching

---

## 10. Future Scope

1. **Recurring Transactions** — Support for subscriptions and monthly bills with automatic generation
2. **Data Export** — CSV and PDF export of financial reports
3. **Bank Import** — CSV or Plaid integration for automatic transaction import
4. **Email Notifications** — Budget alerts and savings milestone notifications via email
5. **Multi-User Budgets** — Family or team budget management with shared categories
6. **Mobile App** — React Native companion app for iOS and Android
7. **Goal Deadlines** — Countdown timers and deadline-based savings plans
8. **Testing** — Unit and integration tests with Vitest and Testing Library
9. **PWA Support** — Service worker for offline access and installability

---

## References

1. React Documentation — https://react.dev
2. Supabase Documentation — https://supabase.com/docs
3. Recharts Documentation — https://recharts.org
4. Vite Documentation — https://vitejs.dev
5. React Router Documentation — https://reactrouter.com

---

## Appendix

### A. Environment Variables

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### B. NPM Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

### C. Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | 19.2.6 | UI framework |
| react-dom | 19.2.6 | DOM rendering |
| react-router-dom | 7.18.0 | Client-side routing |
| recharts | 3.8.1 | Chart components |
| @supabase/supabase-js | 2.108.2 | Supabase client SDK |
