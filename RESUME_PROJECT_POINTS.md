# BudgetPro — Resume & Project Points

---

## GitHub Project Description (Short)

> **BudgetPro** — A full-stack personal finance tracker built with React 19, Vite 8, and Supabase. Track income/expenses, set budget limits, manage savings goals with progress tracking, and visualize spending through interactive Recharts dashboards. Features Supabase Auth with RLS, dark/light theme, multi-currency support, and responsive mobile-first design.

---

## LinkedIn / Portfolio Description

> **BudgetPro** is a production-grade personal finance management application that I built from the ground up using React 19 and Supabase. The app replaces a traditional backend server by leveraging Supabase for authentication, PostgreSQL database, and row-level security — reducing the codebase footprint while maintaining robust data privacy. Users can sign up with email/password, manage full CRUD operations on income and expenses, set category-level budget limits with real-time overspending alerts, create and deposit toward savings goals with visual progress bars, and explore financial analytics through three interactive chart types (pie, bar, area). The app features a 874-line CSS custom property design system supporting dark/light themes, multi-currency formatting (INR, USD, EUR, GBP), and a responsive mobile layout. Every UI state — loading, empty, error, and populated — is handled for a polished user experience.

---

## Resume Bullet Points

### Version 1: Concise / ATS-Optimized

- Built a full-stack personal finance web app using React 19, Vite 8, and Supabase (Postgres + Auth + RLS) for tracking income, expenses, budgets, and savings goals
- Implemented Supabase Row-Level Security policies across 4 database tables ensuring complete user data isolation
- Developed an interactive analytics dashboard with 3 Recharts chart types (Pie, Bar, Area) displaying spending trends, category breakdowns, and monthly summaries with savings rate
- Delivered a responsive, mobile-first UI with dark/light theme toggle, multi-currency support (INR/USD/EUR/GBP), and CSS custom property design system
- Engineered full CRUD operations with search, filter, and sort across expense transactions and savings goals

### Version 2: Strong Project Bullets (Action-Oriented)

- **Architected** a full-stack personal finance tracker eliminating the need for a dedicated backend server by leveraging Supabase for authentication, PostgreSQL database, and row-level data security
- **Designed** a Supabase schema with 4 tables (profiles, transactions, savings_goals, budgets), each with granular RLS policies ensuring users can only access their own data
- **Built** an interactive reports page with 3 Recharts visualizations — pie chart for category breakdown, bar chart for income vs expenses, and area chart for 6-month spending trends with custom tooltips
- **Implemented** a CSS custom property design system (874 lines of tokens) enabling instant dark/light theme switching with zero runtime JavaScript overhead
- **Developed** a responsive sidebar layout with hamburger menu, multi-currency formatting (4 currencies with Indian/international number systems), and comprehensive empty/loading/error/edge-case states across all 4 pages
- **Integrated** Supabase Auth with email/password signup, username-based profiles, session persistence, and automatic profile creation on registration

### Version 3: Interview / Demo-Friendly (Narrative)

> "I built BudgetPro to solve a common problem — most personal finance apps are either too complex or subscription-based. I wanted a clean, free alternative that I could architect from scratch.
>
> The key technical decision was using Supabase as the full backend. Instead of writing a separate Express API, Supabase provides Postgres, authentication, and row-level security out of the box. I designed the schema with 4 tables — profiles, transactions, savings_goals, and budgets — each with RLS policies that filter by `auth.uid()`. This means even though all users share the same database tables, they can never see each other's data.
>
> On the frontend, I used React 19 with Vite 8 for fast builds and React Context for global state management. The service layer abstracts all Supabase queries, keeping the UI code clean. The analytics page was particularly fun — I used Recharts to create a pie chart for category breakdowns, a grouped bar chart for income vs expenses, and an area chart for spending trends, all with custom tooltips.
>
> The CSS design system was another focus area. I wrote 874 lines of CSS custom properties — spacing, colors, typography, borders — so the entire app can switch from dark to light mode by toggling a single `data-theme` attribute on the root element. The app also supports 4 currencies with proper formatting (Indian numbering for INR, standard for USD/EUR/GBP).
>
> One challenge was the budget limit system — ensuring uniqueness on (user, category, month) while allowing fast upserts required careful database design. Another was the savings deposit logic, where the backend caps deposits at the target amount rather than in the UI layer, keeping the business logic in the right place.
>
> The result is a production-ready personal finance app that handles every UI state — loading, empty, error, and edge cases — and is fully responsive on mobile devices."

---

## Key Metrics & Technical Highlights

| Aspect | Detail |
|--------|--------|
| **Pages** | 4: Login, Dashboard, Expense Tracker, Reports |
| **Database Tables** | 4: profiles, transactions, savings_goals, budgets |
| **Chart Types** | 3: Pie (donut), Bar (grouped), Area (stacked) |
| **Services** | 4: auth, transaction, savings, budget |
| **CSS Design System** | 874 lines of design tokens |
| **Currencies** | 4: INR, USD, EUR, GBP |
| **Auth** | Email/password with username |
| **Security** | Row-Level Security on all tables |
| **Languages** | JavaScript (React), SQL, CSS |
| **Dependencies** | react, react-dom, react-router-dom, recharts, @supabase/supabase-js |

---

## Suggested Resume Placement

**Category:** Full-Stack Projects / Web Development Projects

**Suggested Title:** BudgetPro — Full-Stack Personal Finance Tracker

**Technologies:** React 19, Vite 8, Supabase (Auth + Postgres + RLS), Recharts, CSS Custom Properties
