import { supabase } from '../lib/supabaseClient';

const FALLBACK_EVENTS = [
  { title: "Tree Plantation Drive", date: "15 November 2026", place: "Community Park", description: "Plant trees with other volunteers." },
  { title: "Education Awareness Camp", date: "22 November 2026", place: "Community Centre", description: "Help students with learning activities." },
  { title: "Health Awareness Program", date: "5 December 2026", place: "Public Hall", description: "Share information about health and hygiene." }
];

export async function fetchEvents() {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    if (data && data.length > 0) return data;
  } catch (err) {
    console.warn('Supabase events fetch failed, using fallback:', err.message);
  }
  return FALLBACK_EVENTS;
}

export async function fetchEventById(id) {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return { event: data, error: null };
  } catch (err) {
    console.error('Error fetching event by id:', err);
    return { event: null, error: err };
  }
}

export async function createEvent(eventData) {
  try {
    const { data, error } = await supabase
      .from('events')
      .insert([
        {
          title: eventData.title,
          date: eventData.date,
          place: eventData.place,
          description: eventData.description,
          image_url: eventData.image_url || null,
          status: eventData.status || 'Upcoming'
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return { event: data, error: null };
  } catch (err) {
    console.error('Error creating event:', err);
    return { event: null, error: err };
  }
}

export async function updateEvent(id, eventData) {
  try {
    const { data, error } = await supabase
      .from('events')
      .update({
        ...eventData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { event: data, error: null };
  } catch (err) {
    console.error('Error updating event:', err);
    return { event: null, error: err };
  }
}

export async function deleteEvent(id) {
  try {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true, error: null };
  } catch (err) {
    console.error('Error deleting event:', err);
    return { success: false, error: err };
  }
}

export async function registerForEvent(eventId, userId) {
  try {
    const { data, error } = await supabase
      .from('event_registrations')
      .insert([
        {
          event_id: eventId,
          user_id: userId,
          registration_status: 'Registered'
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return { registration: data, error: null };
  } catch (err) {
    console.error('Error registering for event:', err);
    return { registration: null, error: err };
  }
}

