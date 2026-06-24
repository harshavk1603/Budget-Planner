# BudgetPro — Demo Checklist

Use this as a quick-reference checklist before and during a live demo.

---

## Pre-Demo Setup

- [ ] Supabase project is active and accessible
- [ ] `.env` has valid `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- [ ] `supabase_schema.sql` has been run in the SQL Editor (4 tables + RLS)
- [ ] Email confirmation is **disabled** in Authentication > Settings (for instant signup)
- [ ] Demo data seeded via `seed_demo_data.sql` (replace `YOUR_USER_UUID` first)
- [ ] App starts cleanly: `npm run dev` → opens on `http://localhost:5173`
- [ ] Test account created or ready to create during demo
- [ ] Browser zoom at 100%, no extensions blocking popups/modals
- [ ] Dark theme enabled (looks better on projectors/screenshots)

---

## Sample Test User Flow

Use this flow to populate the app with realistic demo data.

### Account

| Field | Value |
|-------|-------|
| Username | `demo_user` |
| Email | `demo@example.com` |
| Password | `demo123` |

### Income Entries

| Source | Amount | Date |
|--------|--------|------|
| Monthly Salary | ₹85,000 | 1st of current month |
| Freelance Project | ₹12,000 | 10th of current month |

### Expenses (6-8 across categories)

| Description | Category | Amount |
|-------------|----------|--------|
| Grocery Store | Food & Dining | ₹4,500 |
| Restaurant Dinner | Food & Dining | ₹1,200 |
| Fuel Top-up | Transport | ₹3,500 |
| New Headphones | Shopping | ₹15,000 |
| Electricity Bill | Bills & Utilities | ₹2,200 |
| Movie Tickets | Entertainment | ₹1,500 |
| Online Course | Education | ₹3,000 |

### Budget Limits

| Category | Limit |
|----------|-------|
| Food & Dining | ₹6,000 |
| Transport | ₹4,000 |
| Shopping | ₹15,000 |
| Bills & Utilities | ₹3,500 |
| Entertainment | ₹3,000 |

### Savings Goals

| Name | Target | Saved | Emoji |
|------|--------|-------|-------|
| Emergency Fund | ₹1,00,000 | ₹35,000 | 🛡️ |
| Vacation Trip | ₹50,000 | ₹12,000 | ✈️ |
| New Laptop | ₹80,000 | ₹54,000 | 💻 |

---

## Pages to Show (in order)

### 1. Login / Signup (15 sec)

- Show the hero panel with feature highlights
- Sign up with a new account (or log in to existing)
- Mention: Supabase Auth, email/password, no email confirmation needed for demos

### 2. Dashboard (30 sec)

- **Stat cards**: Income, Expenses, Balance, Total Saved
- **Greeting** with username and current date
- **Quick-add income**: click "+Add Income", fill form, save → stat cards update instantly
- **Savings goals**: progress bars, emoji icons
- **Budget alerts**: red warning cards if any category is overspent
- Mention: React Context reactivity, real-time UI updates

### 3. Expense Tracker (30 sec)

- **Search bar**: type to filter
- **Category filter** and **month picker**
- **Sort**: by date (newest/oldest), amount (highest/lowest)
- **Add expense**: click "+Add Expense", fill form, save → appears in table
- **Edit/Delete**: modify or remove an expense
- **Budget Limits panel**: set limits, see progress bars with spend vs limit
- Mention: Full CRUD, search/filter/sort, budget uniqueness constraint

### 4. Reports & Analytics (30 sec)

- **Pie chart**: category breakdown for selected month (hover for tooltips)
- **Bar chart**: income vs expenses over last 6 months
- **Area chart**: spending trends with income/expenses/savings lines
- **Monthly Summary table**: income, expenses, savings, savings rate with color-coded badges
- Mention: Recharts integration, 3 chart types, custom tooltips

### 5. Theme & Currency (10 sec)

- Toggle dark/light theme (sun/moon button in topbar)
- Switch currency: INR → USD → EUR → GBP → observe formatting update
- Mention: CSS custom properties, zero runtime overhead, 4 currencies

### 6. Sign Out (5 sec)

- Click Sign Out in sidebar footer → redirect to login

---

## What to Say

### About Supabase

> "Supabase provides the full backend — Postgres database, authentication, and row-level security — without needing a separate Node.js server. This drastically reduces the codebase while maintaining production-grade security."

### About RLS

> "Every table has row-level security policies that filter by `auth.uid()`. Even though all users share the same database tables, each user can only see and modify their own data. This is enforced at the database level, not the application layer."

### About Dashboard Metrics

> "The dashboard uses React Context with `useMemo` to derive income, expenses, balance, and savings from raw transaction data. All stat cards update instantly when data changes — no page refresh needed."

### About Reports

> "Reports use three Recharts visualizations: a pie chart for category breakdowns, a grouped bar chart for income vs expenses over 6 months, and an area chart for spending trends. All charts have custom tooltips and respond to month selection."

### About Architecture

> "The service layer abstracts all Supabase queries, keeping the context and components clean. CSS custom properties power the dark/light theme with a single attribute toggle — no CSS-in-JS runtime cost."

---

## 2-Minute Demo Flow

| Time | Page | Action |
|------|------|--------|
| 0:00 | Login | Sign up with demo credentials |
| 0:15 | Dashboard | Point out stat cards, savings goals, greeting |
| 0:30 | Dashboard | Quick-add income → show stat cards update |
| 0:45 | Expenses | Navigate to expenses, show search/filter |
| 1:00 | Expenses | Add an expense, edit one, delete one |
| 1:15 | Expenses | Open budget limits panel, show progress bars |
| 1:30 | Reports | Show pie chart, bar chart, area chart |
| 1:45 | Reports | Scroll to monthly summary table |
| 1:55 | Any | Toggle dark/light theme, switch currency |
| 2:00 | — | Sign out, closing statement |

---

## 5-Minute Demo Flow

| Time | Page | Action |
|------|------|--------|
| 0:00 | Login | Walk through signup form, create account |
| 0:20 | Dashboard | Explain stat cards, greeting, layout |
| 0:40 | Dashboard | Add income, show reactive updates |
| 1:00 | Dashboard | Create a savings goal, deposit funds |
| 1:20 | Dashboard | Show budget alerts if overspending |
| 1:40 | Expenses | Full CRUD demo: add, search, filter, sort |
| 2:10 | Expenses | Edit and delete an expense |
| 2:30 | Expenses | Budget limits: set limits, show progress bars |
| 3:00 | Reports | Pie chart with category breakdown |
| 3:20 | Reports | Bar chart: income vs expenses |
| 3:40 | Reports | Area chart: spending trends |
| 4:00 | Reports | Monthly summary table, savings rate badges |
| 4:20 | Any | Theme toggle (dark ↔ light) |
| 4:30 | Any | Currency switch: INR → USD → EUR → GBP |
| 4:40 | Any | Responsive: resize browser, show hamburger menu |
| 4:55 | — | Sign out, recap key technical points |
| 5:00 | — | Q&A |

---

## Quick Troubleshooting

| Issue | Fix |
|-------|-----|
| App won't start | Check `.env` has valid Supabase URL and anon key |
| "Invalid login credentials" | Ensure email confirmation is disabled in Supabase |
| Empty dashboard | Seed demo data via `seed_demo_data.sql` |
| Charts not rendering | Check that transactions exist for the selected month |
| Theme not toggling | Clear localStorage and reload |

---

## Closing Statement (copy-paste)

> "BudgetPro demonstrates a full-stack approach using Supabase as the backend, eliminating the need for a custom API server. The app features row-level security for data privacy, interactive charts for financial insights, and a polished UI with dark/light themes and multi-currency support. All code is production-ready and the architecture is scalable."
