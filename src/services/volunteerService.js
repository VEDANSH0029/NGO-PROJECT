import { supabase } from '../lib/supabaseClient';

export async function submitVolunteer(volunteerData) {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    const payload = {
      user_id: user?.id || null,
      name: volunteerData.name,
      email: volunteerData.email,
      phone: volunteerData.phone,
      age: Number(volunteerData.age),
      city: volunteerData.city,
      interest: volunteerData.interest,
      skills: volunteerData.skills,
      availability: volunteerData.availability,
      experience: volunteerData.experience,
      reason: volunteerData.reason,
      status: 'Pending'
    };

    const { error } = await supabase
      .from('volunteers')
      .insert([payload]);

    if (error) {
      console.warn('Supabase volunteer insert error:', error.message);
      // Also cache in localStorage for client resilience
      const local = JSON.parse(localStorage.getItem('ngo_volunteers') || '[]');
      local.push(payload);
      localStorage.setItem('ngo_volunteers', JSON.stringify(local));
      return { success: true, localOnly: true, volunteer: payload };
    }

    // Keep localStorage in sync
    const local = JSON.parse(localStorage.getItem('ngo_volunteers') || '[]');
    local.push(payload);
    localStorage.setItem('ngo_volunteers', JSON.stringify(local));

    return { success: true, volunteer: payload, error: null };
  } catch (err) {
    console.error('Submit volunteer exception:', err);
    return { success: false, error: err };
  }
}

export async function fetchVolunteers() {
  try {
    const { data, error } = await supabase
      .from('volunteers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (data) {
      localStorage.setItem('ngo_volunteers', JSON.stringify(data));
      return data;
    }
  } catch (err) {
    console.warn('Supabase fetchVolunteers failed, fallback to local:', err.message);
  }
  return JSON.parse(localStorage.getItem('ngo_volunteers') || '[]');
}

export async function fetchMyApplications(userId) {
  try {
    const { data, error } = await supabase
      .from('volunteers')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { applications: data || [], error: null };
  } catch (err) {
    console.error('Error fetching my applications:', err);
    return { applications: [], error: err };
  }
}

export async function updateVolunteerStatus(id, status, adminNotes = null) {
  try {
    const updatePayload = {
      status,
      updated_at: new Date().toISOString()
    };
    if (adminNotes !== null) {
      updatePayload.admin_notes = adminNotes;
    }

    const { data, error } = await supabase
      .from('volunteers')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { volunteer: data, error: null };
  } catch (err) {
    console.error('Error updating volunteer status:', err);
    return { volunteer: null, error: err };
  }
}

export async function deleteVolunteer(id) {
  try {
    const { error } = await supabase
      .from('volunteers')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true, error: null };
  } catch (err) {
    console.error('Error deleting volunteer:', err);
    return { success: false, error: err };
  }
}

