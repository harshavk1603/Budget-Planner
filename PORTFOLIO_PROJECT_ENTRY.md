# BudgetPro — Full-Stack Personal Finance Tracker

## One-Line Summary

A production-grade, full-stack personal finance tracker built with React 19 and Supabase — featuring interactive analytics, budget management, savings goals, and a CSS custom-property design system with dark/light theme.

## Portfolio Paragraph

BudgetPro is a full-stack single-page application I built from scratch that replaces a traditional backend server with Supabase (PostgreSQL + Auth + Row-Level Security), reducing the codebase footprint while maintaining robust data privacy. The app supports full CRUD on income and expenses, category-level budget limits with real-time overspending alerts, savings goals with deposit tracking and visual progress bars, and three interactive Recharts visualizations (pie, bar, area) for financial analytics. I designed the entire PostgreSQL schema — 4 tables with RLS policies ensuring complete user data isolation — and implemented a 874-line CSS custom property system for dark/light theme switching with zero runtime overhead. Every UI state (loading, empty, error, populated) is handled across all pages, and the responsive mobile layout includes a hamburger sidebar, multi-currency formatting (INR with Indian numbering, USD, EUR, GBP), and emoji-based icons.

## Tech Stack

**React 19 · Vite 8 · Supabase (Auth + PostgreSQL + RLS) · Recharts 3 · React Router v7 · CSS Custom Properties · ESLint 10**

---

## Resume Bullet Versions

### Version 1 — Concise / ATS-Optimized

- Built a full-stack personal finance web app using React 19, Vite 8, and Supabase (Postgres + Auth + RLS) for tracking income, expenses, budgets, and savings goals
- Implemented Supabase Row-Level Security policies across 4 database tables ensuring complete user data isolation
- Developed an interactive analytics dashboard with 3 Recharts chart types (Pie, Bar, Area) displaying spending trends, category breakdowns, and monthly summaries with savings rate
- Delivered a responsive mobile-first UI with dark/light theme toggle, multi-currency support (INR/USD/EUR/GBP), and a CSS custom property design system spanning 874 lines
- Engineered full CRUD operations with search, filter, and sort across expense transactions and savings goals

### Version 2 — Action-Oriented / Strong Project Bullets

- Architectured a full-stack personal finance tracker eliminating the need for a dedicated backend server by leveraging Supabase for authentication, PostgreSQL database, and row-level data security
- Designed a Supabase schema with 4 tables (profiles, transactions, savings_goals, budgets), each with granular RLS policies ensuring users can only access their own data
- Built an interactive reports page with 3 Recharts visualizations — pie chart for category breakdown, bar chart for income vs expenses, and area chart for 6-month spending trends with custom tooltips
- Implemented a CSS custom property design system (874 lines of tokens) enabling instant dark/light theme switching with zero runtime JavaScript overhead
- Developed a responsive sidebar layout with hamburger menu, multi-currency formatting (4 currencies with Indian/international number systems), and comprehensive empty/loading/error/edge-case states across all 4 pages
- Integrated Supabase Auth with email/password signup, username-based profiles, session persistence, and automatic profile creation on registration

### Version 3 — Interview / Demo-Friendly (Narrative)

> "I built BudgetPro to solve a common problem — most personal finance apps are either too complex or subscription-based. I wanted a clean, free alternative that I could architect from scratch.
>
> The key technical decision was using Supabase as the full backend. Instead of writing a separate Express API, Supabase provides Postgres, authentication, and row-level security out of the box. I designed the schema with 4 tables — profiles, transactions, savings_goals, and budgets — each with RLS policies that filter by auth.uid(). This means even though all users share the same database tables, they can never see each other's data.
>
> On the frontend, I used React 19 with Vite 8 for fast builds and React Context for global state management. The service layer abstracts all Supabase queries, keeping the UI code clean. The analytics page was particularly fun — I used Recharts to create a pie chart for category breakdowns, a grouped bar chart for income vs expenses, and an area chart for spending trends, all with custom tooltips.
>
> The CSS design system was another focus area. I wrote 874 lines of CSS custom properties — spacing, colors, typography, borders — so the entire app can switch from dark to light mode by toggling a single data-theme attribute on the root element. The app also supports 4 currencies with proper formatting (Indian numbering for INR, standard for USD/EUR/GBP).
>
> One challenge was the budget limit system — ensuring uniqueness on (user, category, month) while allowing fast upserts required careful database design. Another was the savings deposit logic, where the backend caps deposits at the target amount rather than in the UI layer, keeping the business logic in the right place.
>
> The result is a production-ready personal finance app that handles every UI state — loading, empty, error, and edge cases — and is fully responsive on mobile devices."

---

## Key Challenges Solved

1. **Serverless Backend Architecture** — Replaced a traditional Express/Node.js API with Supabase (Auth + Postgres + RLS), reducing deployment complexity and eliminating a separate backend server while maintaining full data privacy through database-level security policies.

2. **Budget Limit Enforcement with Uniqueness Constraints** — Designed the `budgets` table with a composite unique constraint on (user_id, category, month), enabling upsert operations that prevent duplicate budget entries per user per month while allowing seamless updates.

3. **Savings Goal Deposit Logic** — Implemented deposit capping at the target amount in the service layer (not the UI), ensuring business rules are enforced server-side and preventing over-deposit regardless of client behavior.

4. **Real-Time Budget Alerts** — Built a reactive alert system that compares per-category spend against budget limits after every transaction mutation, surfacing warnings on the dashboard when spending exceeds 80% and 100% of the limit.

5. **Multi-Currency Formatting** — Implemented locale-aware number formatting supporting Indian numbering system (lakhs/crores) for INR alongside standard international formats for USD, EUR, and GBP, with live switching across all views.

6. **Dark/Light Theme with Zero Runtime Overhead** — Built a 874-line CSS custom property design system where theme switching is a single `data-theme` attribute toggle on the root element — no CSS-in-JS, no runtime style computation, no Flash of Unstyled Content.

7. **Comprehensive State Handling** — Every page and component explicitly handles loading (spinner/skeleton), empty (illustration + CTA), error (toast + message), and populated states, ensuring no dead or broken UI states.

---

## Architecture Summary

```
┌─────────────────────────────────────────────────────┐
│                   React 19 SPA                       │
│  ┌──────────┐  ┌────────────┐  ┌────────────────┐   │
│  │ Dashboard │  │  Expense   │  │    Reports     │   │
│  │   Page    │  │ Tracker    │  │  & Analytics   │   │
│  └────┬─────┘  └─────┬──────┘  └───────┬────────┘   │
│       └──────────────┼─────────────────┘             │
│                      ▼                               │
│  ┌────────────────────────────────────────────────┐   │
│  │         AppProvider (React Context)             │   │
│  │  Global state, auth, CRUD orchestration         │   │
│  └─────────────────────┬──────────────────────────┘   │
│                        ▼                             │
│  ┌────────────────────────────────────────────────┐   │
│  │              Service Layer                      │   │
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

**Key architectural decisions:**
- **React Context over Redux** — The app's scope (single-user finance) made Context the right fit, avoiding Redux boilerplate for 4 service endpoints
- **Service Layer** — All Supabase queries are abstracted into 4 service modules, keeping components focused on rendering and event handling
- **CSS Custom Properties** — Theme switching at the attribute level with zero JavaScript runtime cost
- **Parallel Data Fetching** — Dashboard initializes by fetching transactions, savings goals, and budgets concurrently via Promise.all

**Data flow:** User authenticates via Supabase Auth → session stored in browser → AppProvider initializes with all user data → Pages consume context via the `useApp()` hook → Mutations go through service methods → Supabase SDK → Postgres with RLS → UI updates reactively

---

## Demo Talking Points

### 60-Second Pitch
> "BudgetPro is a full-stack personal finance tracker built with React 19 and Supabase. It lets users track income and expenses, set category-level budget limits with real-time alerts, create savings goals with progress tracking, and visualize spending through interactive Recharts dashboards. The app features Supabase Auth with RLS for data privacy, dark/light theme, multi-currency support, and a fully responsive mobile layout. All data is persisted in PostgreSQL with row-level security ensuring each user sees only their own financial data."

### Technical Highlights to Emphasize
- **Supabase as the full backend** — "I didn't write a single Express route. Supabase handles auth, database, and security policies out of the box, which means this app deploys with just a static host and a Supabase project."
- **RLS for data isolation** — "Every database query is filtered by `auth.uid()` at the database level. Even a malformed client request can't access another user's data."
- **CSS design system** — "The 874-line design system means consistent spacing, color, and typography everywhere. Dark/light mode is instant because it's just an attribute swap on `<html>`."
- **Chart interactivity** — "All three chart types (pie, bar, area) have custom tooltips, responsive containers, and are powered by Recharts 3."
- **No dead states** — "I tracked every possible UI state. If the data is loading, you see a spinner. If it's empty, you see a message with a CTA. If there's an error, you see a friendly toast. The app never breaks silently."

### Common Interview Questions This Project Answers
1. *"Tell me about a full-stack project you built."*
2. *"How do you handle data security and user isolation?"*
3. *"Describe a time you made an architectural trade-off."* (Context vs Redux, Supabase vs custom backend)
4. *"How do you handle loading, empty, and error states?"*
5. *"Walk me through how you'd design a database schema for this app."*

---

## GitHub Project Blurb

> **BudgetPro** — A full-stack personal finance tracker built with React 19, Vite 8, and Supabase. Track income/expenses, set budget limits, manage savings goals with progress tracking, and visualize spending through interactive Recharts dashboards (pie, bar, area charts). Features Supabase Auth with Row-Level Security, dark/light theme toggle, multi-currency support (INR, USD, EUR, GBP), responsive mobile-first design, and comprehensive state handling across all pages.

---

## What I Built / What I Learned

### What I Built
- A 4-page single-page application (Login, Dashboard, Expense Tracker, Reports) with full CRUD on transactions, savings goals, and budgets
- A Supabase backend with 4 PostgreSQL tables and RLS policies for complete user data isolation
- 3 interactive Recharts visualizations (pie/donut, grouped bar, stacked area) with custom tooltips
- A 874-line CSS custom property design system supporting instant dark/light theme switching
- Multi-currency formatting with Indian numbering (lakhs/crores) for INR and international formats for USD/EUR/GBP
- A responsive sidebar layout with hamburger menu, modal forms, and toast notifications
- An optional demo data seed script for quick account population

### What I Learned
- **Supabase as a Backend** — How to leverage BaaS to eliminate a dedicated API server, and the trade-offs (less control over middleware vs faster development velocity)
- **Row-Level Security** — Writing PostgreSQL policies that use `auth.uid()` for automatic data scoping, and understanding how RLS affects query patterns (e.g., why you must handle policy violations gracefully)
- **React 19 Patterns** — Using `use`, `useMemo`, `useCallback`, and Context effectively without over-engineering state management
- **CSS Architecture** — Designing a token-based design system with custom properties that scales across 4 pages and 2 themes without CSS-in-JS dependencies
- **Recharts Integration** — Customizing chart tooltips, responsive containers, and data transformation pipelines for visualization
- **Database Schema Design** — Planning composite unique constraints, indexing strategies, and upsert patterns for a multi-tenant application
- **UI/UX Discipline** — Systematically handling every possible state (loading, empty, error, populated) rather than assuming the happy path
