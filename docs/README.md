# Documentation Assets

## Screenshots

Add app screenshots to `docs/screenshots/` following this naming convention:

| File | Page | What to capture |
|------|------|-----------------|
| `login.png` | Login / Signup | Full login page with hero panel and form |
| `dashboard.png` | Dashboard | Stat cards, greeting, savings goals, budget alerts |
| `expenses.png` | Expense Tracker | Expense table, search/filter bar, budget limits panel |
| `reports.png` | Reports & Analytics | Pie chart, bar chart, area chart, monthly summary table |

### Screenshot Tips

- Use a 1280x800 or 1440x900 viewport for consistent sizing
- Dark theme screenshots tend to look more polished on GitHub
- Include demo data so charts and tables are populated
- Crop out browser chrome for a cleaner look
- Save as PNG for crisp text rendering

### Adding Screenshots

1. Run `npm run dev` and log in with demo data
2. Take screenshots of each page
3. Save to `docs/screenshots/` with the names above
4. The README.md will automatically display them in the Screenshots section

---

## Other Documentation Files

| File | Purpose |
|------|---------|
| `README.md` (root) | Project overview, setup, features, screenshots |
| `DEMO_CHECKLIST.md` | Pre-demo setup, test data, demo flow scripts |
| `PROJECT_DEMO_NOTES.md` | Detailed walkthrough and talking points |
| `RESUME_PROJECT_POINTS.md` | Resume bullets, LinkedIn description, portfolio text |
| `seed_demo_data.sql` | SQL to populate demo data for your account |
| `supabase_schema.sql` | Database schema with RLS policies |
