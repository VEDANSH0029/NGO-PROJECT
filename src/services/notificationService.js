import { supabase } from '../lib/supabaseClient';

export async function fetchNotifications(userId) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { notifications: data || [], error: null };
  } catch (err) {
    console.error('Error fetching notifications:', err);
    return { notifications: [], error: err };
  }
}

export async function markNotificationRead(notificationId) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .select()
      .single();

    if (error) throw error;
    return { notification: data, error: null };
  } catch (err) {
    console.error('Error marking notification as read:', err);
    return { notification: null, error: err };
  }
}

export async function createNotification(userId, title, message, notification_type = 'general') {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert([
        {
          user_id: userId,
          title,
          message,
          notification_type,
          is_read: false
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return { notification: data, error: null };
  } catch (err) {
    console.error('Error creating notification:', err);
    return { notification: null, error: err };
  }
}

