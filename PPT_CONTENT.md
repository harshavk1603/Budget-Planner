# BudgetPro — Presentation (PPT) Content

Slide-by-slide content for a college project presentation.

---

## Slide 1 — Title Slide

**BudgetPro — Smart Budget Planner**

A Full-Stack Personal Finance Tracker

- **Technology:** React 19, Vite 8, Supabase
- **Author:** Harsh Sharma
- **GitHub:** [github.com/harshavk1603/Budget-Planner](https://github.com/harshavk1603/Budget-Planner)

> *Track income, manage expenses, set budgets, and visualize your financial health.*

---

## Slide 2 — Problem Statement

### The Problem

- Most personal finance apps are **subscription-based** or **overly complex**
- Spreadsheet tracking is **manual and error-prone**
- Existing tools often have **unclear data privacy** policies
- No single lightweight solution covers **tracking + budgeting + visualization**

### The Need

A free, self-hosted, privacy-focused personal finance tool with comprehensive features.

---

## Slide 3 — Objectives

1. Build a full-stack finance tracker with **income/expense CRUD**
2. Implement **secure authentication** with user data isolation
3. Create **budget limits** with real-time overspending alerts
4. Develop **savings goals** with visual progress tracking
5. Build **interactive charts** for financial insights
6. Deliver a **responsive, dark/light themed** UI
7. Handle **all UI states** (loading, empty, error, populated)

---

## Slide 4 — System Architecture

```
┌─────────────────────────────────────────────────────┐
│                    React 19 SPA                      │
│  ┌──────────┐  ┌────────────┐  ┌────────────────┐   │
│  │ Dashboard │  │  Expense   │  │    Reports     │   │
│  │   Page    │  │ Tracker    │  │  & Analytics   │   │
│  └────┬─────┘  └─────┬──────┘  └───────┬────────┘   │
│       └──────────────┼─────────────────┘             │
│                      ▼                               │
│  ┌────────────────────────────────────────────────┐   │
│  │            AppProvider (Context)                │   │
│  │  Global state, auth, CRUD orchestration         │   │
│  └─────────────────────┬──────────────────────────┘   │
│                        ▼                             │
│  ┌────────────────────────────────────────────────┐   │
│  │            Service Layer                        │   │
│  │  authService | transactionService | savings     │   │
│  │  Service    | budgetService                     │   │
│  └─────────────────────┬──────────────────────────┘   │
└────────────────────────┼──────────────────────────────┘
                         ▼
┌──────────────────────────────────────────────────────┐
│              Supabase Backend                        │
│  ┌──────────┐  ┌────────────┐  ┌────────────────┐    │
│  │  Auth     │  │ PostgreSQL │  │     RLS        │    │
│  │ (email/pw)│  │ 4 tables   │  │  Policies      │    │
│  └──────────┘  └────────────┘  └────────────────┘    │
└──────────────────────────────────────────────────────┘
```

### Data Flow

1. User authenticates via Supabase Auth → session stored
2. AppProvider fetches session + profile + all user data
3. Pages consume context, call service methods for mutations
4. Services query Postgres — RLS ensures data isolation
5. UI updates reactively as context state changes

---

## Slide 5 — Modules

| Module | Description |
|--------|-------------|
| **Authentication** | Email/password signup and login, session persistence, profile creation |
| **Dashboard** | Financial overview: stat cards, greeting, quick-add income, savings goals, budget alerts |
| **Expense Tracker** | Full CRUD with search, filter, sort, and budget limit management |
| **Reports & Analytics** | Pie chart, bar chart, area chart, monthly summary with savings rate |
| **Savings Goals** | Create goals, deposit funds, track progress with visual bars |
| **Budget Limits** | Set per-category spending limits, monitor spend vs limit |
| **Theme & Currency** | Dark/light toggle, 4-currency support with locale formatting |

---

## Slide 6 — Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19, Vite 8 | SPA framework, fast builds |
| **Routing** | React Router v7 | Client-side page navigation |
| **Charts** | Recharts 3 | Pie, Bar, Area visualizations |
| **Backend** | Supabase | Auth, Postgres, RLS |
| **Styling** | CSS Custom Properties | 874-line design system, dark/light theme |
| **State** | React Context | Global state management |
| **Linting** | ESLint 10 | Code quality |

### Dependencies (6 total)
`react`, `react-dom`, `react-router-dom`, `recharts`, `@supabase/supabase-js`

---

## Slide 7 — Database Schema

### 4 Tables with Row-Level Security

| Table | Key Columns | Purpose |
|-------|-------------|---------|
| **profiles** | id (UUID), username | User identity |
| **transactions** | user_id, type, amount, category, date, description | Income & expense records |
| **savings_goals** | user_id, name, target, saved, emoji | Savings targets with progress |
| **budgets** | user_id, category, limit_amount, month | Spending limits per category/month |

### Security

- RLS enabled on all 4 tables
- Policies filter by `auth.uid()` — users see only their own data
- Enforced at database level, not application layer

### Performance

- Indexes on `user_id`, `(user_id, date)`, `(user_id, type)`, `(user_id, month)`
- Unique constraint on `(user_id, category, month)` for budgets

---

## Slide 8 — Screenshots: Login & Dashboard

<!-- Replace with actual screenshots -->

### Login / Signup Page
![Login Page](docs/screenshots/login.png)

- Hero panel with feature highlights
- Email/password authentication
- Username-based profile creation
- Auto-redirect after login

### Dashboard
![Dashboard](docs/screenshots/dashboard.png)

- Stat cards: Income, Expenses, Balance, Total Saved
- Quick-add income modal
- Savings goals with progress bars
- Budget alerts when overspending
- Personalized greeting with date

---

## Slide 9 — Screenshots: Expense Tracker & Reports

<!-- Replace with actual screenshots -->

### Expense Tracker
![Expense Tracker](docs/screenshots/expenses.png)

- Full CRUD operations (Add, Edit, Delete)
- Search bar with keyword filtering
- Category and month filters
- Sort by date or amount
- Budget limits panel with progress bars

### Reports & Analytics
![Reports](docs/screenshots/reports.png)

- Pie chart: category breakdown
- Bar chart: income vs expenses (6 months)
- Area chart: spending trends
- Monthly summary table with savings rate badges

---

## Slide 10 — Key Features Deep Dive

### Real-Time Budget Alerts
- Set spending limits per category per month
- Dashboard compares actual spending against limits
- Red alert cards appear when a category is overspent

### Savings Goals with Progress
- Create goals with target amounts and emoji icons
- Deposit funds toward goals
- Progress bars show percentage complete
- Deposits capped at target amount (business logic in service layer)

### Multi-Currency Support
- INR (Indian numbering: lakhs/crores), USD, EUR, GBP
- Live currency switching updates all formatted values instantly
- Locale-aware formatting

### Dark/Light Theme
- 874 lines of CSS custom properties
- Single `data-theme` attribute toggle
- Persisted in localStorage
- Zero runtime CSS-in-JS overhead

---

## Slide 11 — Results & Outcomes

| Metric | Value |
|--------|-------|
| Pages | 4 (Login, Dashboard, Expense Tracker, Reports) |
| Database Tables | 4 (profiles, transactions, savings_goals, budgets) |
| Chart Types | 3 (Pie, Bar, Area) |
| Services | 4 (auth, transaction, savings, budget) |
| CSS Design System | 874 lines of design tokens |
| Supported Currencies | 4 (INR, USD, EUR, GBP) |
| Dependencies | 6 (react, react-dom, react-router-dom, recharts, supabase-js) |
| UI States Handled | Loading, Empty, Error, Populated |

### Verified Features
- Full CRUD on transactions, savings goals, and budgets
- RLS policies on all tables
- Responsive across desktop, tablet, and mobile
- Form validation, error handling, session persistence
- Search, filter, and sort on expense tracker

---

## Slide 12 — Future Scope

| Enhancement | Description |
|-------------|-------------|
| **Recurring Transactions** | Subscriptions and monthly bills automation |
| **CSV/PDF Export** | Data export for record-keeping |
| **Bank Import** | CSV or Plaid integration for auto-importing transactions |
| **Email Notifications** | Budget alerts sent via email |
| **Multi-User Budgets** | Family or shared budget management |
| **Mobile App** | React Native port for iOS/Android |
| **Deadline Tracking** | Goal countdown timers and reminders |
| **Unit Tests** | Vitest + Testing Library for comprehensive testing |
| **Real-Time Sync** | Supabase real-time subscriptions for multi-device sync |

---

## Slide 13 — Conclusion

### What We Built

- A **production-ready** personal finance tracker covering auth, CRUD, budgeting, savings, and analytics
- **Privacy-first** architecture with row-level security at the database layer
- A **polished UI** with dark/light theme, multi-currency support, and responsive design

### Technical Highlights

- **Full-stack with minimal backend code** — Supabase replaces a custom API server
- **Zero dead states** — every page handles loading, empty, error, and populated states
- **Clean architecture** — service layer abstracts database queries, context manages state, components handle rendering

---

## Slide 14 — Thank You

**BudgetPro — Smart Budget Planner**

- GitHub: [github.com/harshavk1603/Budget-Planner](https://github.com/harshavk1603/Budget-Planner)

**Technologies:** React 19 · Vite 8 · Supabase · Recharts · CSS Custom Properties

> *Questions?*
