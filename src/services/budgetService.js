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
    return data || [];
  },

  async upsert(userId, { category, limit_amount, month }) {
    const { data, error } = await supabase
      .from('budgets')
      .upsert(
        { user_id: userId, category, limit_amount, month },
        { onConflict: 'user_id,category,month' }
      )
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteByCategory(userId, category, month) {
    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('user_id', userId)
      .eq('category', category)
      .eq('month', month);

    if (error) throw error;
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
