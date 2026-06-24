# BudgetPro – Smart Budget Planner

A modern, feature-rich personal finance tracker built with **React 19**, **Vite 8**, and **Supabase**. BudgetPro helps you track income, manage expenses, set savings goals, and visualize your financial health — all with a beautiful dark/light responsive UI.

---

## Features

- **Dashboard** – Financial overview with stat cards (income, expenses, balance, savings), recent transactions, budget alerts, savings goals with progress bars, and quick-add income
- **Expense Tracker** – Full CRUD with search, filter by category/month, sort by date/amount, and budget limit management with spend tracking per category
- **Reports & Analytics** – Pie chart (category breakdown), bar chart (income vs expenses), area chart (spending trends over 6 months), and monthly summary table with savings rate — all powered by Recharts
- **Savings Goals** – Create goals with target amounts, choose emoji icons, track progress with visual progress bars, and deposit funds toward them
- **Authentication** – Sign up / log in with Supabase Auth (email + password, username-based profiles)
- **Multi-Currency** – INR, USD, EUR, GBP support with live currency switching
- **Dark/Light Theme** – Toggle between dark and light mode, persisted in localStorage
- **Responsive Design** – Mobile-friendly sidebar layout with hamburger menu, adaptive grid
- **Row-Level Security** – All data is private to each user via Supabase RLS policies

---

## Tech Stack

| Layer        | Technology                                |
|-------------|-------------------------------------------|
| **Frontend**  | React 19, Vite 8, React Router v7        |
| **Charts**    | Recharts 3 (Pie, Bar, Area charts)       |
| **Backend**   | Supabase (Postgres, Auth, RLS, SDK)      |
| **Styling**   | CSS Custom Properties (design tokens)    |
| **Icons**     | Emoji-based (no icon library dependency)  |
| **Linting**   | ESLint 10                                 |

---

## Architecture Overview

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

1. User authenticates via Supabase Auth → session stored in browser
2. AppProvider initializes by fetching session + profile + all user data
3. Pages consume context via `useApp()` hook, call service methods for mutations
4. Services use Supabase JS SDK to query Postgres — RLS ensures data isolation
5. UI updates reactively as context state changes

---

## Folder Structure

```
.
├── index.html                    # HTML entry point
├── vite.config.js                # Vite configuration
├── supabase_schema.sql           # Database schema & RLS policies
├── seed_demo_data.sql            # Optional: sample data for demos
├── .env.example                  # Environment variable template
├── .gitignore
├── package.json
├── README.md
├── PROJECT_DEMO_NOTES.md         # Detailed demo walkthrough & talking points
├── RESUME_PROJECT_POINTS.md      # Resume bullets & LinkedIn description
├── PROJECT_REPORT_OUTLINE.md     # College report structure & outline
├── docs/                         # Documentation assets
│   ├── README.md                 # Screenshot naming & setup guide
│   └── screenshots/              # App screenshots (add your own)
├── public/
│   ├── favicon.svg
│   └── icons.svg
└── src/
    ├── App.jsx                   # Root component with routing
    ├── main.jsx                  # Entry point
    ├── index.css                 # Global design system (874 lines)
    ├── lib/
    │   └── supabase.js           # Supabase client initialization
    ├── services/
    │   ├── authService.js        # Auth: signup, login, logout, session
    │   ├── transactionService.js # Transaction CRUD
    │   ├── savingsService.js     # Savings goals CRUD + deposit
    │   └── budgetService.js      # Budget limits CRUD
    ├── context/
    │   ├── AppContext.jsx         # React context creation
    │   ├── AppProvider.jsx        # Global state provider (284 lines)
    │   ├── constants.js           # Categories & currencies
    │   └── useApp.js              # Custom hook + re-exports
    ├── components/
    │   ├── Layout.jsx            # Sidebar + topbar shell
    │   ├── Layout.css
    │   ├── StatCard.jsx          # Dashboard stat card
    │   └── StatCard.css
    └── pages/
        ├── LoginPage.jsx         # Auth page with hero panel
        ├── LoginPage.css
        ├── DashboardPage.jsx     # Main dashboard (398 lines)
        ├── Dashboard.css
        ├── ExpenseTrackerPage.jsx # Expense CRUD + budget limits
        ├── ExpenseTracker.css
        ├── ReportsPage.jsx       # Analytics & charts (287 lines)
        └── Reports.css
```

---

## Supabase Setup

### 1. Create a Supabase project

Go to [supabase.com](https://supabase.com) and create a new project. Once it's ready:

### 2. Run the database schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Open `supabase_schema.sql` from this repo
3. Copy and paste the entire SQL into the editor
4. Click **Run** — this creates all 4 tables with RLS policies:
   - `profiles` — user profiles with username
   - `transactions` — income and expense records
   - `savings_goals` — savings targets with progress tracking
   - `budgets` — category-level budget limits per month

### 3. Configure authentication

1. Go to **Authentication > Providers**
2. Ensure the **Email** provider is turned **On** (click to expand, toggle enabled)
3. Go to **Authentication > Settings**
4. Under **Email Auth**, disable **Confirm email** if you want instant sign-up without email verification (recommended for demos)
5. Under **Site URL**, set your app URL (e.g., `http://localhost:5173`)
6. Click **Save**

### 4. Get your API credentials

1. Go to **Project Settings > API**
2. Copy your **Project URL** and **anon public key**

---

## Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Then edit `.env`:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

> **Note:** The app will throw an error at startup if these are missing or invalid.

---

## How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env with your Supabase credentials

# 3. Start dev server
npm run dev

# 4. Build for production
npm run build

# 5. Preview production build
npm run preview

# 6. Lint
npm run lint
```

| Command              | Description                   |
|----------------------|-------------------------------|
| `npm run dev`        | Start Vite dev server         |
| `npm run build`      | Build for production          |
| `npm run preview`    | Preview production build      |
| `npm run lint`       | Run ESLint                    |

---

## Optional: Load Demo Data

To see the app populated with sample data for your demo:

1. **Sign up** for an account in the app
2. In your Supabase dashboard, go to **Authentication > Users** and copy your **User UUID**
3. Open `seed_demo_data.sql` and replace `YOUR_USER_UUID` with your actual UUID
4. Run the modified SQL in the **SQL Editor**

This adds sample income, expenses, savings goals, and budget limits to your account only. It is completely optional and does not affect other users.

> To remove demo data later, you can delete the rows from `transactions`, `savings_goals`, and `budgets` tables filtered by your `user_id`.

---

## Screenshots / UI Preview

> Screenshots are placeholders — add your own to `docs/screenshots/` and they will appear below.

<!-- ============================================================
     SCREENSHOTS
     To add screenshots:
       1. Run `npm run dev`
       2. Take a screenshot of each page (1280×800 recommended)
       3. Save to docs/screenshots/ with the filenames below
       4. Uncomment the lines in this section
     ============================================================ -->

<!-- ### Login / Signup -->
<!-- ![Login Page](docs/screenshots/login.png) -->

<!-- ### Dashboard -->
<!-- ![Dashboard Overview](docs/screenshots/dashboard.png) -->

<!-- ### Expense Tracker -->
<!-- ![Expense Tracker with search, filters, and budget limits](docs/screenshots/expenses.png) -->

<!-- ### Reports & Analytics -->
<!-- ![Reports — pie chart, bar chart, area chart, monthly summary](docs/screenshots/reports.png) -->

| Page | Screenshot | Description |
|------|-----------|-------------|
| Login / Signup | `docs/screenshots/login.png` | Auth page with hero panel, email/password form, and feature highlights |
| Dashboard | `docs/screenshots/dashboard.png` | Stat cards (income, expenses, balance, savings), savings goals, budget alerts, quick-add income |
| Expense Tracker | `docs/screenshots/expenses.png` | Full CRUD table with search, category filter, month picker, sort options, and budget limits panel |
| Reports & Analytics | `docs/screenshots/reports.png` | Pie chart (category breakdown), bar chart (income vs expenses), area chart (spending trends), monthly summary table |

---

## Future Enhancements

- [ ] Recurring transactions (subscriptions, monthly bills)
- [ ] Export data to CSV/PDF
- [ ] Bank/card import via CSV or Plaid
- [ ] Email notifications for budget alerts
- [ ] Multi-user / family budgets
- [ ] Mobile app (React Native)
- [ ] Dark/light theme improvements with more accent options
- [ ] Goal deadline tracking with countdown
- [ ] Unit & integration tests (Vitest + Testing Library)

---

## Author

**Harsh Sharma** — Full-stack developer

- GitHub: [@harshavk1603](https://github.com/harshavk1603)
- Project: [BudgetPro](https://github.com/harshavk1603/Budget-Planner)

---

## License

This project is for personal/portfolio use.
