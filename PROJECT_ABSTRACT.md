# BudgetPro — Project Abstract

---

## Abstract

BudgetPro is a full-stack personal finance management web application built with React 19, Vite 8, and Supabase. The application enables users to track income and expenses, set category-level budget limits with real-time overspending alerts, create and manage savings goals with visual progress tracking, and visualize financial patterns through interactive charts. The system leverages Supabase as a Backend-as-a-Service (BaaS) platform, providing PostgreSQL database hosting, email/password authentication, and row-level security (RLS) — eliminating the need for a custom API server. The frontend uses React Context for global state management, a service layer to abstract database queries, and a 874-line CSS custom property design system for dark/light theming. The application supports four currencies (INR, USD, EUR, GBP) with locale-aware formatting and is fully responsive across devices.

---

## Problem Statement

Personal finance management is essential for financial discipline, yet most existing solutions are either subscription-based, overly complex, or lack data privacy. Spreadsheet-based tracking is manual and error-prone, while mobile-first finance apps often require account creation on third-party platforms with unclear data usage policies. There is a need for a lightweight, self-hosted, and privacy-focused personal finance tool that provides comprehensive tracking, budgeting, and visualization capabilities without recurring costs or data-sharing concerns.

---

## Objectives

1. Design and implement a full-stack personal finance tracker with income/expense CRUD operations
2. Build a secure backend using Supabase with row-level security ensuring user data isolation
3. Implement category-level budget limits with real-time overspending detection and alerts
4. Develop a savings goal system with target amounts, emoji icons, and progress tracking
5. Create interactive financial visualizations using pie, bar, and area charts
6. Deliver a responsive, mobile-first UI with dark/light theme and multi-currency support
7. Handle all UI states (loading, empty, error, populated) for a production-grade experience

---

## Key Features

| Feature | Description |
|---------|-------------|
| **Authentication** | Email/password signup and login via Supabase Auth with username-based profiles |
| **Dashboard** | Financial overview with stat cards (income, expenses, balance, savings), greeting, quick-add income, savings goals, and budget alerts |
| **Expense Tracker** | Full CRUD with search, category filter, month picker, sort (date/amount), and budget limit management |
| **Reports & Analytics** | Pie chart (category breakdown), bar chart (income vs expenses), area chart (spending trends), and monthly summary table with savings rate |
| **Savings Goals** | Create goals with target amounts, emoji icons, deposit funds, visual progress bars |
| **Budget Limits** | Set spending limits per category per month with progress bars showing spend vs limit |
| **Dark/Light Theme** | Toggle between themes via CSS custom properties, persisted in localStorage |
| **Multi-Currency** | INR, USD, EUR, GBP with live currency switching and locale-aware formatting |
| **Responsive Design** | Mobile-friendly sidebar with hamburger menu, adaptive grid layouts |
| **Row-Level Security** | All database tables secured with RLS policies filtering by `auth.uid()` |

---

## Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend Framework | React 19 |
| Build Tool | Vite 8 |
| Routing | React Router v7 |
| Charts | Recharts 3 (Pie, Bar, Area) |
| Backend | Supabase (PostgreSQL, Auth, RLS) |
| Styling | CSS Custom Properties (874-line design system) |
| State Management | React Context + useState/useMemo |
| Linting | ESLint 10 |
| Languages | JavaScript (JSX), SQL, CSS |

---

## System Architecture

The application follows a three-tier architecture:

**Presentation Layer** — React 19 SPA with four pages (Login, Dashboard, Expense Tracker, Reports), a shared Layout component (sidebar + topbar), and a StatCard reusable component.

**Business Logic Layer** — React Context (AppProvider) manages global state and CRUD orchestration. Four service modules (authService, transactionService, savingsService, budgetService) abstract all Supabase queries.

**Data Layer** — Supabase backend with PostgreSQL hosting four tables (profiles, transactions, savings_goals, budgets), each protected by row-level security policies.

---

## Database Schema

| Table | Columns | Purpose |
|-------|---------|---------|
| `profiles` | id (UUID, FK → auth.users), username (text, unique), created_at | User profile with username |
| `transactions` | id (UUID), user_id (UUID, FK), type ('income'/'expense'), amount (numeric), category (text), description (text), date (date), note (text), created_at | Income and expense records |
| `savings_goals` | id (UUID), user_id (UUID, FK), name (text), target (numeric), saved (numeric, default 0), emoji (text), deadline (date), created_at | Savings targets with progress |
| `budgets` | id (UUID), user_id (UUID, FK), category (text), limit_amount (numeric), month (text: YYYY-MM), created_at | Category-level budget limits per month |

Unique constraint on `budgets`: `(user_id, category, month)` with upsert support.

---

## Outcome Summary

- **4 fully functional pages** — Login, Dashboard, Expense Tracker, Reports
- **4 database tables** with RLS policies on all tables
- **4 service modules** abstracting Supabase queries
- **3 chart types** — Pie (donut), Bar (grouped), Area (stacked trends)
- **4 supported currencies** — INR, USD, EUR, GBP
- **874 lines** of CSS custom property design tokens
- **Responsive** across desktop, tablet, and mobile viewports
- **Zero dead states** — loading, empty, error, and populated states handled on all pages
- **Production-ready** — form validation, error handling, session persistence, auto-redirect after auth
