import { supabase } from '../lib/supabase';

export const budgetService = {
  async fetchAll(userId) {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', userId)
      .eq('month', currentMonth);

    if (error) throw error;
    const limits = {};
    (data || []).forEach((b) => { limits[b.category] = Number(b.limit_amount); });
    return limits;
  },

  async setAll(userId, limits) {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const { error: delError } = await supabase
      .from('budgets')
      .delete()
      .eq('user_id', userId)
      .eq('month', currentMonth);

    if (delError) throw delError;

    const entries = Object.entries(limits).map(([category, limit_amount]) => ({
      user_id: userId,
      category,
      limit_amount,
      month: currentMonth,
    }));

    if (entries.length > 0) {
      const { error: insError } = await supabase.from('budgets').insert(entries);
      if (insError) throw insError;
    }

    return limits;
  },
};
