import { fetchEvents, fetchEventById, createEvent, updateEvent, deleteEvent } from './eventService';
import { submitVolunteer, fetchVolunteers, updateVolunteerStatus, deleteVolunteer } from './volunteerService';
import { submitDonation, fetchDonations, fetchDonationStats, updateDonationStatus } from './donationService';
import { signIn, signOut, getCurrentUser, getUserProfile, isUserAdmin } from './authService';
import { fetchDashboardStats } from './adminService';

export {
  fetchEvents,
  fetchEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  submitVolunteer,
  fetchVolunteers,
  updateVolunteerStatus,
  deleteVolunteer,
  submitDonation,
  fetchDonations,
  fetchDonationStats,
  updateDonationStatus,
  fetchDashboardStats,
  signIn,
  signOut,
  getCurrentUser,
  getUserProfile,
  isUserAdmin
};

// Legacy compatibility helpers
export async function loginAdmin(usernameOrEmail, password) {
  // Support both username 'admin' and email 'admin@hopeconnect.org'
  const email = usernameOrEmail.includes('@') ? usernameOrEmail : (usernameOrEmail === 'admin' ? 'admin@hopeconnect.org' : usernameOrEmail);
  const { data, error } = await signIn({ email, password });
  if (error || !data?.user) {
    return { success: false, message: error?.message || 'Incorrect username or password.' };
  }
  const isAdmin = isUserAdmin(data.user);
  if (!isAdmin) {
    return { success: false, message: 'Access denied: User is not an authorized administrator.' };
  }
  sessionStorage.setItem("ngo_demo_admin", "yes");
  return { success: true, user: data.user };
}

export function checkAdminSession() {
  return sessionStorage.getItem("ngo_demo_admin") === "yes";
}

export async function logoutAdmin() {
  sessionStorage.removeItem("ngo_demo_admin");
  await signOut();
}
