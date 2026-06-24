# BudgetPro – Smart Budget Planner

A modern, feature-rich personal finance tracker built with **React 19**, **Vite 8**, and **Supabase**.

## Features

- **Dashboard** – Overview of income, expenses, balance, and savings with stat cards, recent transactions, and budget alerts
- **Expense Tracker** – Full CRUD with search, filter by category/month, sort by date/amount, and budget limit management
- **Reports & Analytics** – Pie chart (category breakdown), bar chart (income vs expenses), area chart (spending trends), and monthly summary table with savings rate — all powered by Recharts
- **Savings Goals** – Create goals with target amounts, track progress with visual progress bars, and deposit funds toward them
- **Auth** – Sign up / log in with Supabase Auth (username-based, using email internally)
- **Multi-currency** – INR, USD, EUR, GBP support
- **Dark/Light Theme** – Toggle between dark and light mode (persisted in localStorage)
- **Responsive** – Mobile-friendly sidebar layout with hamburger menu

## Tech Stack

- React 19 + Vite 8
- React Router v7
- Recharts 3 (charts)
- Supabase (auth, database, RLS)
- CSS custom properties (design tokens)

## Getting Started

### 1. Clone and install

```bash
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the SQL in `supabase_schema.sql` to create all tables and RLS policies
3. Go to **Project Settings > API** and copy your **URL** and **anon key**

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run the app

```bash
npm run dev
```

### 5. Build for production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── App.jsx                  # Root component with routing
├── main.jsx                 # Entry point
├── index.css                # Global design system
├── lib/
│   └── supabase.js          # Supabase client
├── services/
│   ├── authService.js       # Auth (signup, login, logout)
│   ├── transactionService.js# Transaction CRUD
│   ├── savingsService.js    # Savings goals CRUD
│   └── budgetService.js     # Budget limits CRUD
├── context/
│   ├── AppContext.jsx        # Global state (Supabase-backed)
│   └── constants.js          # Categories and currencies
├── components/
│   ├── Layout.jsx            # Sidebar + topbar shell
│   └── StatCard.jsx          # Dashboard stat card
└── pages/
    ├── LoginPage.jsx         # Auth page
    ├── DashboardPage.jsx     # Main dashboard
    ├── ExpenseTrackerPage.jsx# Expense CRUD + budget limits
    └── ReportsPage.jsx       # Analytics & charts
```

## Manual Supabase Setup

After running the SQL in `supabase_schema.sql`, verify:

1. **Auth > Settings** – Confirm email/password auth is enabled
2. **Auth > Settings** – Disable "Confirm email" in email templates if you want instant sign-up (no email confirmation required)
3. **SQL Editor** – Run the schema file to create tables: `profiles`, `transactions`, `savings_goals`, `budgets` with RLS policies

## Scripts

| Command         | Description              |
|-----------------|--------------------------|
| `npm run dev`   | Start dev server         |
| `npm run build` | Build for production     |
| `npm run preview` | Preview production build |
| `npm run lint`  | Run ESLint               |
