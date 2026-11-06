import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL || 'https://ujbtindpvqpmwfujakya.supabase.co';
const pubKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_b3JRx9E4YRcO8m3TjXbSqQ_O9m7yhJl';
const secKey = process.env.SUPABASE_SECRET_KEY || pubKey;

async function checkDatabase() {
  console.log('====================================================');
  console.log('🔍 HOPECONNECT NGO - SUPABASE DATABASE STATUS CHECK');
  console.log('Project URL:', url);
  console.log('====================================================\n');

  const supabase = createClient(url, secKey);
  const pubClient = createClient(url, pubKey);

  // 1. Check Auth Users
  const { data: usersData, error: usersErr } = await supabase.auth.admin.listUsers();
  if (usersErr) {
    console.error('❌ Error checking auth users:', usersErr.message);
  } else {
    console.log(`✅ Auth Users Found: ${usersData.users.length}`);
    usersData.users.forEach(u => {
      console.log(`   - ${u.email} | Role: ${u.app_metadata?.role || 'volunteer'} | Confirmed: ${u.email_confirmed_at ? 'Yes' : 'No'}`);
    });
  }

  // 2. Check Tables
  const tables = [
    'events',
    'volunteers',
    'donations',
    'profiles',
    'event_registrations',
    'notifications',
    'admin_logs'
  ];

  console.log('\n📊 Checking PostgreSQL Public Tables:');
  for (const table of tables) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .limit(1);

    if (error) {
      if (error.code === 'PGRST205' || error.code === '42P01' || (error.message && error.message.includes('schema cache'))) {
        console.log(`⚠️  Table "${table}": NOT CREATED YET (Please run supabase/full_schema_setup.sql in Supabase SQL Editor)`);
      } else {
        console.log(`❌ Table "${table}": Error (${error.message})`);
      }
    } else {
      console.log(`✅ Table "${table}": CREATED & READY`);
    }
  }

  // 3. Test Public Client Read
  console.log('\n🌐 Testing Anonymous/Public Key Access:');
  const { data: publicEvents, error: pubErr } = await pubClient
    .from('events')
    .select('*')
    .limit(1);

  if (pubErr) {
    console.log('ℹ️  Public read test:', pubErr.message);
  } else {
    console.log('✅ Public read test passed (events accessible to anonymous users)');
  }

  console.log('\n====================================================');
  console.log('🏁 Diagnostic Check Completed');
  console.log('====================================================\n');
}

checkDatabase();
