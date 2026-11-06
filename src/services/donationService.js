import { supabase } from '../lib/supabaseClient';

export async function submitDonation(donationData) {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    const payload = {
      user_id: user?.id || null,
      donor_name: donationData.name,
      donor_email: donationData.email,
      amount: Number(donationData.amount),
      payment_method: donationData.method || 'Demo pledge',
      payment_status: 'Pledge Recorded', // Note: Pledges are not verified paid
      donor_message: donationData.donor_message || null,
      transaction_reference: donationData.transaction_reference || null
    };

    const { error } = await supabase
      .from('donations')
      .insert([payload]);

    if (error) {
      console.warn('Supabase donation insert error:', error.message);
      // Fallback cache in localStorage
      const local = JSON.parse(localStorage.getItem('ngo_donations') || '[]');
      local.push(payload);
      localStorage.setItem('ngo_donations', JSON.stringify(local));
      return { success: true, localOnly: true, donation: payload };
    }

    // Keep localStorage in sync
    const local = JSON.parse(localStorage.getItem('ngo_donations') || '[]');
    local.push(payload);
    localStorage.setItem('ngo_donations', JSON.stringify(local));

    return { success: true, donation: payload, error: null };
  } catch (err) {
    console.error('Submit donation exception:', err);
    return { success: false, error: err };
  }
}

export async function fetchDonations() {
  try {
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (data) {
      localStorage.setItem('ngo_donations', JSON.stringify(data));
      return data;
    }
  } catch (err) {
    console.warn('Supabase fetchDonations failed, fallback to local:', err.message);
  }
  return JSON.parse(localStorage.getItem('ngo_donations') || '[]');
}

export async function fetchMyDonations(userId) {
  try {
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { donations: data || [], error: null };
  } catch (err) {
    console.error('Error fetching my donations:', err);
    return { donations: [], error: err };
  }
}

export async function fetchDonationStats() {
  try {
    const donations = await fetchDonations();
    const totalPledges = donations.length;
    const verifiedDonations = donations.filter(d => d.payment_status === 'Verified Paid');
    const verifiedAmount = verifiedDonations.reduce((sum, d) => sum + Number(d.amount || 0), 0);
    const totalPledgeAmount = donations.reduce((sum, d) => sum + Number(d.amount || 0), 0);

    return {
      totalPledges,
      verifiedCount: verifiedDonations.length,
      verifiedAmount,
      totalPledgeAmount
    };
  } catch (err) {
    console.error('Error calculating donation stats:', err);
    return {
      totalPledges: 0,
      verifiedCount: 0,
      verifiedAmount: 0,
      totalPledgeAmount: 0
    };
  }
}

export async function updateDonationStatus(id, payment_status, transaction_reference = null) {
  try {
    const updatePayload = {
      payment_status,
      updated_at: new Date().toISOString()
    };
    if (transaction_reference) {
      updatePayload.transaction_reference = transaction_reference;
    }

    const { data, error } = await supabase
      .from('donations')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { donation: data, error: null };
  } catch (err) {
    console.error('Error updating donation status:', err);
    return { donation: null, error: err };
  }
}

