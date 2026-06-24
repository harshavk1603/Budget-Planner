# BudgetPro — Viva / Interview Questions

Concise model answers based on the actual BudgetPro architecture and source code.

---

## General / Project Overview

### 1. What is BudgetPro?

A full-stack personal finance tracker built with React 19 and Supabase. It lets users track income/expenses, set budget limits, manage savings goals, and visualize spending through interactive charts.

### 2. Why did you choose this project?

Personal finance apps are either too complex or subscription-based. I wanted a clean, free alternative that I could architect from scratch — covering auth, database, CRUD, charts, and responsive UI in one project.

### 3. What problem does it solve?

It provides a self-contained, privacy-focused alternative to spreadsheet-based expense tracking with real-time budget alerts and financial visualizations.

### 4. What are the main modules of the application?

Four pages: Login/Signup, Dashboard, Expense Tracker, Reports & Analytics. Plus a service layer (auth, transaction, savings, budget services) and a shared Layout component.

### 5. How many tables does the database have?

Four: `profiles`, `transactions`, `savings_goals`, and `budgets`. All are secured with row-level security policies.

---

## Supabase & Backend

### 6. Why did you use Supabase instead of a custom Node.js/Express backend?

Supabase provides Postgres, authentication, and row-level security out of the box. This eliminated the need for a separate API server while maintaining production-grade security and data isolation.

### 7. What is Supabase?

An open-source Backend-as-a-Service (BaaS) platform that provides a Postgres database, authentication, real-time subscriptions, edge functions, and row-level security — similar to Firebase but built on PostgreSQL.

### 8. How does the frontend connect to Supabase?

Via the `@supabase/supabase-js` SDK. The client is initialized in `src/lib/supabase.js` using the project URL and anon key from environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).

### 9. What are the two required environment variables?

`VITE_SUPABASE_URL` — the Supabase project URL (e.g., `https://xxx.supabase.co`)
`VITE_SUPABASE_ANON_KEY` — the anonymous/public API key

### 10. How is authentication handled?

Supabase Auth with email/password. On signup, the app calls `supabase.auth.signUp()` and then inserts a row into the `profiles` table with the user's UUID and chosen username. The `onAuthStateChange` listener keeps the session in sync.

---

## Row-Level Security (RLS)

### 11. What is Row-Level Security?

A PostgreSQL feature that lets you define policies on tables to control which rows a user can read, insert, update, or delete — based on their authentication identity (`auth.uid()`).

### 12. How is RLS used in BudgetPro?

Every table has RLS enabled with policies like:
```sql
CREATE POLICY "Users can view their own transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = user_id);
```
This means each user can only see and modify their own data, even though all users share the same database table.

### 13. Is RLS enforced at the application layer or database layer?

Database layer. Even if someone bypasses the frontend, the Postgres engine itself enforces the policy. This is more secure than application-level filtering.

### 14. How many RLS policies are defined per table?

Typically 3-4 per table: SELECT (view own), INSERT (insert own), UPDATE (update own), DELETE (delete own).

---

## React & State Management

### 15. Why did you use React Context instead of Redux?

The app has a focused scope — context provides enough state management without the boilerplate of Redux. A single AppProvider wraps all pages and exposes state + mutations via the `useApp()` hook.

### 16. What is the `useApp()` hook?

A custom hook defined in `src/context/useApp.js` that calls `useContext(AppContext)` and returns the full context value. Pages use it like: `const { transactions, addTransaction } = useApp()`.

### 17. How is global state structured in AppProvider?

The AppProvider manages: `session`, `user`, `profile` (auth state); `transactions`, `savingsGoals`, `budgets`, `budgetLimits` (data state); `theme`, `currency` (UI preferences). Derived values like `totalIncome`, `totalExpenses`, `balance`, `totalSaved` are computed inline.

### 18. How does data loading work on login?

`AppProvider` listens to `onAuthStateChange`. When a session is detected, it fetches the user's profile from the `profiles` table, then loads all transactions, savings goals, and budgets in parallel using `Promise.all`.

### 19. Why use `Promise.all` for data loading?

Fetching transactions, savings goals, and budgets in parallel reduces total load time. All three queries are independent and can run concurrently.

### 20. How does the UI update after a mutation?

Each mutation (add/update/delete) calls the service, then updates the corresponding state array via `setState`. React re-renders affected components automatically.

---

## Service Layer

### 21. What is the service layer?

Four JavaScript modules (`authService.js`, `transactionService.js`, `savingsService.js`, `budgetService.js`) that encapsulate all Supabase queries. This keeps the context and components clean — they call service methods instead of writing Supabase queries directly.

### 22. How does the savings deposit logic work?

In `savingsService.deposit()`, the current `saved` and `target` are fetched first. The new saved amount is `Math.min(saved + amount, target)` — capping deposits at the target. This business logic lives in the service, not the UI.

### 23. How does budget upsert work?

`budgetService.upsert()` uses Supabase's `upsert` with `onConflict: 'user_id,category,month'`. If a budget already exists for that user/category/month, it updates the limit. Otherwise, it inserts a new row.

---

## Charts & Reports

### 24. What chart library does BudgetPro use?

Recharts 3 — a React-based charting library built on D3.js.

### 25. What chart types are implemented?

Three:
- **Pie chart** — expense category breakdown for a selected month
- **Bar chart** — grouped bar showing income vs expenses over the last 6 months
- **Area chart** — spending trends with income, expenses, and savings lines

### 26. How is the monthly savings rate calculated?

`savings rate = ((income - expenses) / income) × 100`. Displayed with color-coded badges: green (≥20%), yellow (≥10%), red (<10%).

### 27. How does the Reports page handle month selection?

A month picker filters transactions for the selected month. The pie chart and summary update reactively based on the filtered data.

---

## Budgeting Logic

### 28. How are budget limits stored?

In the `budgets` table with columns: `user_id`, `category`, `limit_amount`, `month` (YYYY-MM format). A unique constraint on `(user_id, category, month)` ensures one limit per category per month per user.

### 29. How does the app detect overspending?

On the Dashboard, the app calculates total expenses per category for the current month, compares against the budget limit, and shows a red alert card for any category where spending exceeds the limit.

### 30. What happens when a user sets budget limits?

The `setBudgetLimits` function in AppProvider iterates over the limits object and calls `budgetService.upsert()` for each category. After all upserts complete, it re-fetches all budgets and updates the `budgetLimits` state.

---

## Savings Goals

### 31. How are savings goals structured?

Each goal has: `name`, `target` (amount), `saved` (current amount), `emoji` (icon), and optional `deadline`. Progress is visualized as a percentage bar.

### 32. Can deposits exceed the target amount?

No. The `savingsService.deposit()` method caps the saved amount at the target: `Math.min(saved + amount, target)`.

### 33. How is total saved calculated?

In AppProvider: `totalSaved = savingsGoals.reduce((sum, g) => sum + Number(g.saved), 0)`. This is displayed on the Dashboard stat card.

---

## Styling & Theme

### 34. How does the dark/light theme work?

CSS custom properties (variables) define all colors. The `data-theme` attribute on `<html>` toggles between dark and light variable sets. Toggling the attribute swaps the entire color scheme with zero runtime CSS-in-JS overhead.

### 35. Why use CSS custom properties instead of a CSS-in-JS library?

Zero runtime cost. The theme switch is just an attribute toggle — no JavaScript re-rendering of styles. The 874-line design system covers spacing, colors, typography, and borders.

### 36. How is the theme persisted?

In `localStorage` under the key `bp_theme`. On load, `AppProvider` reads from localStorage and sets the initial theme state.

### 37. How is currency formatting handled?

A `formatCurrency` utility function takes a numeric value and the current currency object (symbol, code). For INR, it uses Indian numbering (lakhs/crores). For USD/EUR/GBP, it uses standard international formatting.

---

## Responsive Design

### 38. How does the mobile layout work?

The sidebar collapses into a hamburger menu on smaller screens. The dashboard uses CSS Grid with adaptive columns. The layout component handles the responsive shell.

### 39. What CSS techniques are used for responsiveness?

CSS Grid for page layouts, Flexbox for component alignment, media queries for breakpoints, and CSS custom properties for consistent spacing across screen sizes.

---

## Challenges & Decisions

### 40. What was the most challenging part of the project?

Designing the budget limit system — ensuring uniqueness on `(user, category, month)` while allowing fast upserts required careful schema design. The savings deposit logic (capping at target in the service layer) was another key decision.

### 41. Why did you put business logic in the service layer instead of the UI?

Separation of concerns. The UI handles rendering and user input. The service layer handles data validation and business rules. This makes the code more testable and maintainable.

### 42. How would you scale this application for production?

Add unit/integration tests (Vitest + Testing Library), implement recurring transactions, add CSV/PDF export, add email notifications for budget alerts, and consider a mobile app with React Native.

### 43. What would you do differently next time?

Add comprehensive testing from the start, implement real-time subscriptions for multi-device sync, and consider adding a family/shared budget feature.

### 44. How do you handle loading states?

`AppProvider` has a `loading` boolean that is `true` during the initial session check. The app shows a loading spinner until the auth state is resolved, then renders the appropriate page.

### 45. How do you handle empty states?

Each page checks if its data array is empty and renders a dedicated empty state component with an illustration and call-to-action (e.g., "No transactions yet — add your first one!").
