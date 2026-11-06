import { supabase } from '../lib/supabaseClient';

export async function signUp({ email, password, fullName, phone, city }) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone,
          city
        }
      }
    });

    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('Error signing up:', err);
    return { data: null, error: err };
  }
}

export async function signIn({ email, password }) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('Error signing in:', err);
    return { data: null, error: err };
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (err) {
    console.error('Error signing out:', err);
    return { error: err };
  }
}

export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null;
    return user;
  } catch (err) {
    console.error('Error getting current user:', err);
    return null;
  }
}

export async function getUserProfile(userId) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return { profile: data, error: null };
  } catch (err) {
    console.error('Error fetching user profile:', err);
    return { profile: null, error: err };
  }
}

export async function resetPassword(email) {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('Error requesting password reset:', err);
    return { data: null, error: err };
  }
}

export async function updatePassword(newPassword) {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('Error updating password:', err);
    return { data: null, error: err };
  }
}

export function isUserAdmin(user, profile) {
  if (!user) return false;
  // Trust app_metadata first as per security guidelines
  if (user?.app_metadata?.role === 'admin') return true;
  if (profile?.role === 'admin') return true;
  return false;
}

