import { supabase } from '../lib/supabase';

export const transactionService = {
  async fetchAll(userId) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async fetchByMonth(userId, month) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .like('date', `${month}%`)
      .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async add(userId, transaction) {
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        type: transaction.type,
        amount: transaction.amount,
        category: transaction.category,
        description: transaction.description,
        date: transaction.date,
        note: transaction.note,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(userId, id, updates) {
    const { data, error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(userId, id) {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
  },
};