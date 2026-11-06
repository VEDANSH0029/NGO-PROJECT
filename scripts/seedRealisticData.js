import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL || 'https://ujbtindpvqpmwfujakya.supabase.co';
const secKey = process.env.SUPABASE_SECRET_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_b3JRx9E4YRcO8m3TjXbSqQ_O9m7yhJl';
const supabase = createClient(url, secKey);

const REALISTIC_EVENTS = [
  {
    title: "Tree Plantation & Urban Green Drive",
    date: "15 November 2026",
    place: "Sanjay Van Community Park, South Delhi",
    description: "Join 100+ volunteers to plant 500 indigenous saplings and restore green cover in urban parks.",
    image_url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
    status: "Upcoming"
  },
  {
    title: "Digital Literacy & Free School Camp",
    date: "22 November 2026",
    place: "Hope Learning Centre, Sector 4, Jaipur",
    description: "Empower underprivileged school children with basic computer skills, reading sessions, and stationary kits.",
    image_url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80",
    status: "Upcoming"
  },
  {
    title: "Free Community Health & Eye Checkup Camp",
    date: "5 December 2026",
    place: "Civil Lines Community Hall, Lucknow",
    description: "Volunteer doctors and medics providing free basic health checkups, vision tests, and generic medicines.",
    image_url: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80",
    status: "Upcoming"
  },
  {
    title: "Winter Clothes & Blanket Relief Drive",
    date: "18 December 2026",
    place: "Rain Basera & Slum Clusters, Kanpur",
    description: "Distribute warm woolens, sweaters, and blankets to night shelter residents and families in need.",
    image_url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80",
    status: "Upcoming"
  },
  {
    title: "Food Distribution & Hunger Relief Camp",
    date: "28 December 2026",
    place: "Central Railway Station Slums, Bhopal",
    description: "Providing wholesome nutritious meals and clean drinking water to over 400 daily-wage families.",
    image_url: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80",
    status: "Upcoming"
  },
  {
    title: "Women Vocational Skills & Tailoring Workshop",
    date: "10 January 2027",
    place: "Rural Development Kendra, Varanasi",
    description: "Training rural women in garment making, handicrafts, and financial literacy to support self-reliance.",
    image_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
    status: "Upcoming"
  },
  {
    title: "Yamuna Riverbank Cleanliness Campaign",
    date: "24 January 2027",
    place: "Taj Protected Riverbank Ghats, Agra",
    description: "Youth volunteer drive to segregate and remove plastic waste, creating awareness on clean waterways.",
    image_url: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80",
    status: "Upcoming"
  },
  {
    title: "Voluntary Blood Donation & Thalassemia Camp",
    date: "8 February 2027",
    place: "Rotary Youth Center, Sector 18, Chandigarh",
    description: "Safe certified blood donation drive in partnership with Red Cross society to help emergency wards.",
    image_url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80",
    status: "Upcoming"
  }
];

const REALISTIC_VOLUNTEERS = [
  {
    name: "Rohan Sharma",
    email: "rohan.sharma@example.com",
    phone: "9876543210",
    age: 21,
    city: "New Delhi",
    interest: "Education",
    skills: "Teaching, Mathematics, Youth Mentorship",
    availability: "Weekends",
    experience: "1–3 years",
    reason: "I have been tutoring kids in my neighborhood for two years and want to contribute to structured weekend teaching camps.",
    status: "Approved",
    admin_notes: "Strong teaching background. Assigned to North Delhi learning center."
  },
  {
    name: "Ananya Deshmukh",
    email: "ananya.d@example.com",
    phone: "9812345678",
    age: 24,
    city: "Mumbai",
    interest: "Environment",
    skills: "Waste management, Botany, Event Coordination",
    availability: "Flexible",
    experience: "More than 3 years",
    reason: "Passionate about urban forestry and waste segregation. Have organized 5 tree plantation drives in college.",
    status: "Approved",
    admin_notes: "Experienced drive coordinator. Assigned to plantation logistics."
  },
  {
    name: "Vikram Malhotra",
    email: "vikram.m@example.com",
    phone: "9765432109",
    age: 28,
    city: "Bengaluru",
    interest: "Healthcare",
    skills: "First Aid Certified, Patient Registration, Logistics",
    availability: "Weekends",
    experience: "1–3 years",
    reason: "Certified in CPR and basic first aid. I want to assist doctors during free suburban medical camps.",
    status: "Approved",
    admin_notes: "First aid certificate verified."
  },
  {
    name: "Pooja Verma",
    email: "pooja.v@example.com",
    phone: "9654321098",
    age: 19,
    city: "Jaipur",
    interest: "Education",
    skills: "English communication, Arts & Crafts, Storytelling",
    availability: "Weekdays",
    experience: "Less than 1 year",
    reason: "I love spending time with young learners and teaching them through creative art, rhymes and interactive games.",
    status: "Pending",
    admin_notes: null
  },
  {
    name: "Mohammad Irfan",
    email: "irfan.m@example.com",
    phone: "9543210987",
    age: 26,
    city: "Lucknow",
    interest: "Community Service",
    skills: "Food handling, Driving, Field Distribution",
    availability: "Flexible",
    experience: "1–3 years",
    reason: "I have a personal vehicle and free weekday evenings to help pack and distribute relief meals across shelters.",
    status: "Pending",
    admin_notes: null
  },
  {
    name: "Sneha Kulkarni",
    email: "sneha.k@example.com",
    phone: "9432109876",
    age: 22,
    city: "Pune",
    interest: "Fundraising & Outreach",
    skills: "Social Media, Video Editing, Content Creation",
    availability: "Weekends",
    experience: "1–3 years",
    reason: "I want to help the NGO increase its digital presence, tell impactful volunteer stories, and reach more donors.",
    status: "Approved",
    admin_notes: "Managing HopeConnect media team."
  },
  {
    name: "Arjun Reddy",
    email: "arjun.r@example.com",
    phone: "9321098765",
    age: 30,
    city: "Hyderabad",
    interest: "Healthcare",
    skills: "Medical inventory management, Blood camp support",
    availability: "Weekends",
    experience: "More than 3 years",
    reason: "Volunteered with blood banks for 4 years. Want to assist in organizing emergency donor databases.",
    status: "Approved",
    admin_notes: "Excellent blood bank network."
  },
  {
    name: "Neha Sundaram",
    email: "neha.s@example.com",
    phone: "9210987654",
    age: 20,
    city: "Chennai",
    interest: "Environment",
    skills: "Beach cleaning, Coastal preservation awareness",
    availability: "Weekends",
    experience: "No experience yet",
    reason: "As a college student, I want to step out of classroom theory and physically help clean and restore public beaches.",
    status: "Pending",
    admin_notes: null
  },
  {
    name: "Karan Joharwal",
    email: "karan.j@example.com",
    phone: "9109876543",
    age: 25,
    city: "Ahmedabad",
    interest: "Community Service",
    skills: "Disaster relief, Heavy lifting, Packing kits",
    availability: "Flexible",
    experience: "Less than 1 year",
    reason: "Ready for on-ground fieldwork, loading relief supplies, and managing emergency queues during food distribution drives.",
    status: "Pending",
    admin_notes: null
  },
  {
    name: "Divya Chauhan",
    email: "divya.c@example.com",
    phone: "9098765432",
    age: 23,
    city: "Chandigarh",
    interest: "Education",
    skills: "Science demonstration, Basic coding for school kids",
    availability: "Weekends",
    experience: "1–3 years",
    reason: "B.Tech graduate aiming to ignite curiosity for STEM subjects in kids who lack access to school science laboratories.",
    status: "Approved",
    admin_notes: "Assigned to Saturday science workshop."
  }
];

const REALISTIC_DONATIONS = [
  {
    donor_name: "Priya Nair",
    donor_email: "priya.nair@example.com",
    amount: 1500,
    payment_method: "Google Pay (UPI)",
    payment_status: "Verified Paid",
    transaction_reference: "UPI/2026/GPay-7749102",
    donor_message: "Keep up the wonderful work for underprivileged children's education!"
  },
  {
    donor_name: "Amitabh Banerjee",
    donor_email: "amitabh.b@example.com",
    amount: 5000,
    payment_method: "PhonePe (UPI)",
    payment_status: "Verified Paid",
    transaction_reference: "UPI/2026/PhonePe-883921",
    donor_message: "In memory of my grandmother. Please use this for winter blanket distribution."
  },
  {
    donor_name: "Rajesh & Sunita Gupta",
    donor_email: "gupta.family@example.com",
    amount: 2500,
    payment_method: "Paytm (UPI)",
    payment_status: "Verified Paid",
    transaction_reference: "UPI/2026/Paytm-440291",
    donor_message: "Happy to support the tree plantation and water conservation efforts."
  },
  {
    donor_name: "Kavita Singhania",
    donor_email: "kavita.s@example.com",
    amount: 1000,
    payment_method: "Google Pay (UPI)",
    payment_status: "Verified Paid",
    transaction_reference: "UPI/2026/GPay-994012",
    donor_message: "Small token of appreciation for your healthcare outreach camp."
  },
  {
    donor_name: "Harish Venkat",
    donor_email: "harish.v@example.com",
    amount: 500,
    payment_method: "Scan QR (demo)",
    payment_status: "Pledge Recorded",
    transaction_reference: "DEMO-QR-33019",
    donor_message: "Demo pledge from Chennai community supporters."
  },
  {
    donor_name: "Simran Kaur",
    donor_email: "simran.k@example.com",
    amount: 2000,
    payment_method: "BHIM (UPI)",
    payment_status: "Verified Paid",
    transaction_reference: "UPI/2026/BHIM-559218",
    donor_message: "For providing digital notebooks and school bags to students."
  },
  {
    donor_name: "Deepak Mehra",
    donor_email: "deepak.m@example.com",
    amount: 1000,
    payment_method: "PhonePe (UPI)",
    payment_status: "Pledge Recorded",
    transaction_reference: "UPI/2026/PhonePe-PLEDGE",
    donor_message: "Pledge recorded during community outreach drive."
  },
  {
    donor_name: "Meera Joshi",
    donor_email: "meera.j@example.com",
    amount: 500,
    payment_method: "Card (demo)",
    payment_status: "Pledge Recorded",
    transaction_reference: "DEMO-CARD-8812",
    donor_message: "Support from Bangalore youth club."
  }
];

async function seedData() {
  console.log("🌱 Seeding realistic data into Supabase...");

  // 1. Seed Events
  for (const evt of REALISTIC_EVENTS) {
    const { data: existing } = await supabase
      .from('events')
      .select('id')
      .eq('title', evt.title)
      .limit(1);

    if (!existing || existing.length === 0) {
      await supabase.from('events').insert([evt]);
      console.log(`  + Event created: ${evt.title}`);
    } else {
      // Update image_url and details
      await supabase.from('events').update(evt).eq('id', existing[0].id);
      console.log(`  ~ Event updated with image: ${evt.title}`);
    }
  }

  // 2. Seed Volunteers
  for (const vol of REALISTIC_VOLUNTEERS) {
    const { data: existing } = await supabase
      .from('volunteers')
      .select('id')
      .eq('email', vol.email)
      .limit(1);

    if (!existing || existing.length === 0) {
      await supabase.from('volunteers').insert([vol]);
      console.log(`  + Volunteer application added: ${vol.name} (${vol.status})`);
    }
  }

  // 3. Seed Donations
  for (const don of REALISTIC_DONATIONS) {
    const { data: existing } = await supabase
      .from('donations')
      .select('id')
      .eq('donor_email', don.donor_email)
      .limit(1);

    if (!existing || existing.length === 0) {
      await supabase.from('donations').insert([don]);
      console.log(`  + Donation pledge added: ${don.donor_name} (₹${don.amount} - ${don.payment_status})`);
    }
  }

  console.log("✅ Seed complete! All realistic data loaded into Supabase.");
}

seedData();

