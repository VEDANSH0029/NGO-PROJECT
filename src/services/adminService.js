import { supabase } from '../lib/supabaseClient';
import { fetchVolunteers } from './volunteerService';
import { fetchDonations, fetchDonationStats } from './donationService';
import { fetchEvents } from './eventService';

export async function fetchDashboardStats() {
  try {
    const [volunteers, donations, events, donationStats] = await Promise.all([
      fetchVolunteers(),
      fetchDonations(),
      fetchEvents(),
      fetchDonationStats()
    ]);

    const pendingVolunteers = volunteers.filter(v => (v.status || 'Pending') === 'Pending').length;
    const approvedVolunteers = volunteers.filter(v => v.status === 'Approved').length;
    const rejectedVolunteers = volunteers.filter(v => v.status === 'Rejected').length;

    return {
      totalVolunteers: volunteers.length,
      pendingVolunteers,
      approvedVolunteers,
      rejectedVolunteers,
      totalEvents: events.length,
      totalDonationPledges: donations.length,
      verifiedDonations: donationStats.verifiedCount,
      verifiedDonationAmount: donationStats.verifiedAmount,
      totalPledgeAmount: donationStats.totalPledgeAmount
    };
  } catch (err) {
    console.error('Error fetching admin dashboard stats:', err);
    return {
      totalVolunteers: 0,
      pendingVolunteers: 0,
      approvedVolunteers: 0,
      rejectedVolunteers: 0,
      totalEvents: 0,
      totalDonationPledges: 0,
      verifiedDonations: 0,
      verifiedDonationAmount: 0,
      totalPledgeAmount: 0
    };
  }
}

export async function logAdminAction(action, entityType = null, entityId = null) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('admin_logs')
      .insert([
        {
          admin_id: user.id,
          action,
          entity_type: entityType,
          entity_id: entityId
        }
      ]);
  } catch (err) {
    console.warn('Logging admin action non-critical warning:', err.message);
  }
}

