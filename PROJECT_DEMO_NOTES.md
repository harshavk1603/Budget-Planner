# BudgetPro — Project Demo Notes

Use this guide for demo presentations, walkthroughs, and talking points.

---

## 60-Second Project Summary

> BudgetPro is a full-stack personal finance tracker built with React 19 and Supabase. It lets users track income and expenses, set category-level budget limits with real-time alerts, create savings goals with progress tracking, and visualize spending patterns through interactive Recharts dashboards (pie, bar, and area charts). The app features Supabase Auth with RLS for data privacy, dark/light theme, multi-currency support (INR, USD, EUR, GBP), and a fully responsive mobile-first layout. All data is persisted in PostgreSQL with row-level security ensuring each user sees only their own financial data.

---

## 2-Minute Demo Walkthrough

### 0. Preparation (before demo)

- [ ] Ensure `.env` has valid Supabase credentials
- [ ] Run `npm run dev` — app starts on `http://localhost:5173`
- [ ] Have a test account ready (or use sign-up flow as part of demo)
- [ ] Pre-populate some sample transactions if possible (6-8 expenses across categories, 2-3 income entries, 2 savings goals, 2-3 budget limits)

### 1. Authentication (15 seconds)

1. Show login page with hero panel describing features
2. **Sign up** with a new username, email, and password
3. Note that no email confirmation is required (can be toggled in Supabase)
4. Upon sign-up, user is redirected to the dashboard

### 2. Dashboard Overview (30 seconds)

1. Point out the **stat cards** at the top: Income, Expenses, Balance, Total Saved
2. Show the **greeting** with username and current date
3. **Quick-add income** — click "+Add Income", fill source + amount + date, save
4. Observe stat cards update instantly (context-driven reactivity)
5. **Savings goals section** — show any pre-existing goals with progress bars
6. If budget limits exist, show any triggered **budget alerts** (red warning cards)

### 3. Expense Tracker (30 seconds)

1. Navigate to **Expenses** via sidebar
2. Show search bar — type to filter expenses
3. Filter by category dropdown and month picker
4. Sort by date (newest/oldest) and amount (highest/lowest)
5. Click **"+Add Expense"** — fill description, amount, category, date, note
6. Show the new expense appearing in the table
7. Click **edit** (✏️) to modify an expense
8. Click **delete** (🗑) to remove an expense (with confirmation dialog)
9. Open **Budget Limits** panel — set limits per category, observe progress bars showing spend vs limit

### 4. Reports & Analytics (30 seconds)

1. Navigate to **Reports** via sidebar
2. **Pie chart** — category breakdown for selected month (hover for tooltips)
3. **Bar chart** — income vs expenses over the last 6 months
4. **Area chart** — spending trends with income, expenses, and savings lines
5. Scroll to **Monthly Summary** table — shows income, expenses, savings, and savings rate per month with color-coded badges (green ≥20%, yellow ≥10%, red <10%)

### 5. Theme & Currency (10 seconds)

1. Toggle **dark/light theme** using the sun/moon button in the topbar
2. Switch **currency** between INR, USD, EUR, GBP — observe all formatted values update instantly

### 6. Savings Goals (15 seconds)

1. Click **"+New Goal"** on dashboard
2. Select an emoji icon, name the goal, set a target amount
3. Use the **deposit** input to add funds toward the goal
4. Watch the progress bar fill and percentage update
5. Delete a goal with the 🗑 button

### 7. Sign Out (5 seconds)

1. Click **Sign Out** in the sidebar footer
2. User is redirected to login page

---

## Feature Checklist for Demo

| Feature | Status | Notes |
|---------|--------|-------|
| Sign up with username + email + password | ✅ | |
| Log in with email + password | ✅ | |
| Auto-redirect after auth | ✅ | |
| Dashboard stat cards (income, expenses, balance, savings) | ✅ | |
| Quick-add income modal | ✅ | |
| Savings goals creation with emoji picker | ✅ | |
| Savings goal deposit + progress bar | ✅ | |
| Budget alerts when overspending | ✅ | |
| Greeting with username + date | ✅ | |
| Expense CRUD (add, edit, delete) | ✅ | |
| Search expenses by keyword | ✅ | |
| Filter by category | ✅ | |
| Filter by month | ✅ | |
| Sort by date (asc/desc) | ✅ | |
| Sort by amount (asc/desc) | ✅ | |
| Budget limits per category with progress bars | ✅ | |
| Pie chart (category breakdown) | ✅ | |
| Bar chart (income vs expenses, 6 months) | ✅ | |
| Area chart (spending trends) | ✅ | |
| Monthly summary table with savings rate | ✅ | |
| Dark/light theme toggle | ✅ | |
| Multi-currency (INR, USD, EUR, GBP) | ✅ | |
| Responsive sidebar with hamburger menu | ✅ | |
| Empty states for all sections | ✅ | |
| Loading state during auth check | ✅ | |
| Form validation (required fields, email format, password length) | ✅ | |
| Error handling with user-friendly messages | ✅ | |
| Row-Level Security (RLS) | ✅ | |

---

## Sample Test User Flow

> Use this flow to demo the app with realistic data.

### Setup

1. Go to `/login`, click **Sign Up**
2. Username: `demo_user`
3. Email: `demo@example.com`
4. Password: `demo123`

### Step 1: Add Income

1. Dashboard → click **"+Add Income"**
2. Source: `Freelance Project`
3. Amount: `50000`
4. Date: current date
5. Note: `Web development contract`
6. Click **Save Income**
7. Repeat with: Salary, `120000`, 1st of current month

### Step 2: Set Budget Limits

1. Go to **Expenses** → click **"⚙️ Budget Limits"**
2. Set limits:
   - Food & Dining: `15000`
   - Transport: `5000`
   - Shopping: `10000`
   - Bills & Utilities: `8000`
3. Click **Save Limits**

### Step 3: Add Expenses

1. Click **"+Add Expense"** — add several:
   - Grocery shopping — Food & Dining — `4500` — today
   - Uber ride — Transport — `350` — today
   - Amazon haul — Shopping — `3200` — yesterday
   - Electricity bill — Bills & Utilities — `2200` — 2 days ago
   - Netflix subscription — Entertainment — `1499` — 1st of month
   - Udemy course — Education — `2500` — last week

### Step 4: Create Savings Goals

1. Dashboard → **"+New Goal"**
2. Goal: `Emergency Fund` — `₹500000` — pick 🏠 emoji
3. Create another: `New Laptop` — `₹150000` — pick 📱 emoji
4. Deposit `₹25000` into Emergency Fund
5. Deposit `₹50000` into New Laptop

### Step 5: Explore Reports

1. Go to **Reports**
2. Observe pie chart showing category distribution
3. Hover over chart sections for tooltips
4. Switch month to see different data
5. Scroll through the monthly summary table

---

## Common Talking Points

### Why Supabase?

- "Supabase provides a complete backend-as-a-service with Postgres, authentication, and row-level security — eliminating the need for a separate Node.js/Express API layer."
- "RLS policies ensure that each user's data is completely isolated, even though all data lives in the same database table."
- "The Supabase JS SDK handles real-time state changes and session management out of the box."

### Architecture Decisions

- "I chose React Context over Redux because the app has a focused scope — context provides enough state management without the boilerplate of Redux."
- "The service layer abstracts all Supabase queries, making the context and components cleaner and easier to test."
- "CSS custom properties enable the dark/light theme with zero runtime CSS-in-JS overhead — just toggling a `data-theme` attribute on the root element."

### What Makes It Technically Strong

- **Full-stack with minimal backend code** — Supabase replaces a custom API server
- **Row-Level Security** — Data privacy baked into the database layer
- **Reactive UI** — Context + state hooks provide instant UI updates after any mutation
- **Responsive design** — Mobile sidebar with hamburger menu works across devices
- **Dark/light theme** — Persisted preference with CSS custom properties
- **Multi-currency** — Live formatting with Indian number system (lakhs/crores) + international formats
- **Interactive charts** — Recharts provides three chart types with custom tooltips
- **No dead states** — Every section handles loading, empty, error, and populated states

### Challenges Overcome

- "Designing the Supabase schema to support monthly budget limits with uniqueness constraints on user + category + month required careful planning of the `budgets` table."
- "The savings goal deposit logic needed to cap at the target amount — handled in `savingsService.deposit()`, not the UI layer."
- "Balancing dashboard state — fetching transactions, savings goals, and budgets in parallel with `Promise.all` and handling loading states cleanly was important for UX."

---

## Technical Strengths Summary

| Area | Strength |
|------|----------|
| **Auth** | Supabase Auth with session persistence, `onAuthStateChange` listener, auto-profile creation |
| **Security** | Row-Level Security on all 4 tables — users can only access their own data |
| **CRUD** | Full create, read, update, delete on transactions, savings goals, and budgets |
| **Charts** | 3 Recharts types: Pie (donut), Bar (grouped), Area (stacked trends) with custom tooltips |
| **Responsive** | CSS Grid + Flexbox + hamburger sidebar |
| **Theme** | Dark/light with CSS variables — 0 runtime, just attribute toggle |
| **State** | React Context + custom hooks with `useMemo` for derived data |
| **Currency** | 4 currencies with locale-aware formatting (Indian numbering for INR) |
| **UI/UX** | Empty states, loading spinner, form validation, error toasts, animated modals |
| **Data** | ~874 lines of CSS design system with consistent spacing/color/typography tokens |
