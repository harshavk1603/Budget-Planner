import { supabase } from '../lib/supabase';

export const savingsService = {
  async fetchAll(userId) {
    const { data, error } = await supabase
      .from('savings_goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async add(userId, goal) {
    const { data, error } = await supabase
      .from('savings_goals')
      .insert({
        user_id: userId,
        name: goal.name,
        target: goal.target,
        saved: goal.saved || 0,
        emoji: goal.emoji || '🎯',
        deadline: goal.deadline || null,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(userId, id, updates) {
    const { data, error } = await supabase
      .from('savings_goals')
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
      .from('savings_goals')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
  },

  async deposit(userId, id, amount) {
    const { data: goal, error: fetchError } = await supabase
      .from('savings_goals')
      .select('saved, target')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (fetchError) throw fetchError;

    const newSaved = Math.min(Number(goal.saved) + Number(amount), Number(goal.target));

    const { data, error } = await supabase
      .from('savings_goals')
      .update({ saved: newSaved })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};