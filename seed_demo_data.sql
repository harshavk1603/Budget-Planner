-- =============================================
-- OPTIONAL: Demo Data Seed for BudgetPro
-- =============================================
--
-- This file is OPTIONAL. It populates your account with sample
-- transactions, savings goals, and budget limits so you can see
-- the app in action immediately after setup.
--
-- HOW TO USE:
-- 1. Sign up for an account in the app first
-- 2. In Supabase dashboard, go to Authentication > Users and copy your User UUID
-- 3. Replace YOUR_USER_UUID below with your actual UUID
-- 4. Run this SQL in the SQL Editor
--
-- NOTE: This only affects YOUR account. Other users are not impacted.
-- =============================================

-- Replace this with your actual user UUID from Authentication > Users
-- Example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
DO $$
DECLARE
  uid UUID := 'YOUR_USER_UUID';  -- <-- PASTE YOUR UUID HERE
  current_mon TEXT := to_char(current_date, 'YYYY-MM');
  last_mon TEXT := to_char(current_date - interval '1 month', 'YYYY-MM');
  two_mon TEXT := to_char(current_date - interval '2 months', 'YYYY-MM');
BEGIN
  -- Guard: do nothing if placeholder not replaced
  IF uid = 'YOUR_USER_UUID' THEN
    RAISE NOTICE 'Please replace YOUR_USER_UUID with your actual user UUID.';
    RETURN;
  END IF;

  -- ── Transactions (income + expenses) ──
  INSERT INTO public.transactions (user_id, type, amount, category, description, date, note) VALUES
    -- Current month income
    (uid, 'income', 85000, 'income', 'Monthly Salary', current_mon || '-01', 'Full-time job'),
    (uid, 'income', 12000, 'income', 'Freelance Project', current_mon || '-10', 'Website redesign'),

    -- Current month expenses
    (uid, 'expense', 4500, 'food', 'Grocery Store', current_mon || '-02', 'Weekly groceries'),
    (uid, 'expense', 1200, 'food', 'Restaurant Dinner', current_mon || '-05', 'Dinner with friends'),
    (uid, 'expense', 3500, 'transport', 'Fuel Top-up', current_mon || '-03', ''),
    (uid, 'expense', 800, 'transport', 'Metro Card Recharge', current_mon || '-01', ''),
    (uid, 'expense', 15000, 'shopping', 'New Headphones', current_mon || '-07', 'Sony WH-1000XM5'),
    (uid, 'expense', 2200, 'bills', 'Electricity Bill', current_mon || '-05', ''),
    (uid, 'expense', 999, 'bills', 'Internet Bill', current_mon || '-01', 'Monthly broadband'),
    (uid, 'expense', 1500, 'entertainment', 'Movie Tickets', current_mon || '-08', 'Weekend movie'),
    (uid, 'expense', 3000, 'education', 'Online Course', current_mon || '-04', 'React advanced patterns'),
    (uid, 'expense', 500, 'others', 'Miscellaneous', current_mon || '-06', ''),

    -- Last month expenses
    (uid, 'expense', 4200, 'food', 'Groceries', last_mon || '-03', ''),
    (uid, 'expense', 900, 'food', 'Cafe', last_mon || '-10', ''),
    (uid, 'expense', 3200, 'transport', 'Fuel', last_mon || '-05', ''),
    (uid, 'expense', 12000, 'shopping', 'Running Shoes', last_mon || '-12', 'Nike Air Max'),
    (uid, 'expense', 2100, 'bills', 'Electricity', last_mon || '-04', ''),
    (uid, 'expense', 999, 'bills', 'Internet', last_mon || '-01', ''),

    -- Two months ago expenses
    (uid, 'expense', 3800, 'food', 'Groceries', two_mon || '-02', ''),
    (uid, 'expense', 2500, 'transport', 'Fuel', two_mon || '-06', ''),
    (uid, 'expense', 5000, 'shopping', 'Backpack', two_mon || '-08', 'Travel backpack');

  -- ── Savings Goals ──
  INSERT INTO public.savings_goals (user_id, name, target, saved, emoji, deadline) VALUES
    (uid, 'Emergency Fund', 100000, 35000, '🛡️', current_mon || '-28'),
    (uid, 'Vacation Trip', 50000, 12000, '✈️', NULL),
    (uid, 'New Laptop', 80000, 54000, '💻', NULL);

  -- ── Budget Limits (current month) ──
  INSERT INTO public.budgets (user_id, category, limit_amount, month) VALUES
    (uid, 'food', 6000, current_mon),
    (uid, 'transport', 4000, current_mon),
    (uid, 'shopping', 15000, current_mon),
    (uid, 'bills', 3500, current_mon),
    (uid, 'entertainment', 3000, current_mon),
    (uid, 'education', 5000, current_mon),
    (uid, 'others', 2000, current_mon);

  RAISE NOTICE 'Demo data seeded successfully for user %', uid;
END $$;
