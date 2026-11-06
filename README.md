# HopeConnect NGO — React 18 & Supabase PostgreSQL Full-Stack Architecture

HopeConnect NGO is an Outreach and Management Web Application built with **React 18**, **Vite**, and **Supabase (PostgreSQL, Auth, RLS & Realtime)**.

---

## 🏗️ Architecture Overview

- **Frontend**: React 18.3.1, React Router v6, custom responsive CSS (100% exact design preserved).
- **Backend & Database**: Supabase PostgreSQL database (`ujbtindpvqpmwfujakya`).
- **Authentication**: Real Supabase Auth with secure role-based access (`app_metadata.role = 'admin'`).
- **Realtime**: Subscriptions on `volunteers`, `donations`, and `events` for instant UI synchronization.
- **Security**: PostgreSQL Row Level Security (RLS) on all tables with custom security functions.

---

## 🗄️ Database Tables (`public` schema)

1. **`profiles`**: User metadata, full name, phone, city, avatar, and role (`volunteer` vs `admin`).
2. **`events`**: Community events (Tree Plantation, Education Camp, Health Awareness) with status.
3. **`volunteers`**: Applications with personal info, skills, availability, 30+ character reason, and review status.
4. **`donations`**: Pledges with amount, donor info, payment method (UPI / QR / Card), and verification status.
5. **`event_registrations`**: Unique registrations per user and event.
6. **`notifications`**: User alerts and announcements.
7. **`admin_logs`**: Administrative audit trail.

---

## ⚡ 1-Step Database Setup

Run the master SQL script in your Supabase Dashboard:

1. Open [Supabase Dashboard](https://supabase.com/dashboard/project/ujbtindpvqpmwfujakya).
2. Go to **SQL Editor** -> **New query**.
3. Copy the entire contents of [`supabase/full_schema_setup.sql`](supabase/full_schema_setup.sql) and paste into the editor.
4. Click **Run** (Cmd/Ctrl + Enter).
5. Verify in terminal:
   ```bash
   npm run db:check
   ```

---

## 🛠️ How to Run Locally

### 1. Start the React 18 Application
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Verify Database Status
```bash
npm run db:check
```

### 3. Production Build
```bash
npm run build
```

---

## 🔑 Provisioned Accounts

- **Admin Portal (`/admin`)**:
  - **Email**: `admin@hopeconnect.org` (or simply enter `admin`)
  - **Password**: `Admin@123456!`
  - Role: `admin` (provisioned with `app_metadata`)


- **Volunteer Account**:
  - **Email**: `volunteer@hopeconnect.org`
  - **Password**: `Volunteer@123456!`
  - Role: `volunteer`
