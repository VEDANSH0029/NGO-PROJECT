import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const dataFilePath = path.join(__dirname, 'db.json');

const initialData = {
  events: [
    { title: "Tree Plantation Drive", date: "15 November 2026", place: "Community Park", description: "Plant trees with other volunteers." },
    { title: "Education Awareness Camp", date: "22 November 2026", place: "Community Centre", description: "Help students with learning activities." },
    { title: "Health Awareness Program", date: "5 December 2026", place: "Public Hall", description: "Share information about health and hygiene." }
  ],
  volunteers: [],
  donations: []
};

function readDb() {
  try {
    if (!fs.existsSync(dataFilePath)) {
      fs.writeFileSync(dataFilePath, JSON.stringify(initialData, null, 2));
      return initialData;
    }
    const raw = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading DB, using initial data:', err);
    return initialData;
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing DB:', err);
  }
}

// Events
app.get('/api/events', (req, res) => {
  const db = readDb();
  res.json(db.events);
});

// Volunteers
app.get('/api/volunteers', (req, res) => {
  const db = readDb();
  res.json(db.volunteers);
});

app.post('/api/volunteers', (req, res) => {
  const { name, email, phone, age, city, interest, skills, availability, experience, reason } = req.body;
  if (!name || !email || !/^[0-9]{10}$/.test(phone) || !age || age < 16 || age > 100 || !city || !interest || !skills || !availability || !experience || !reason || reason.length < 30) {
    return res.status(400).json({ error: 'Please complete all required fields. Your reason must be at least 30 characters.' });
  }

  const db = readDb();
  const newVolunteer = {
    id: Date.now().toString(),
    name,
    email,
    phone,
    age: Number(age),
    city,
    interest,
    skills,
    availability,
    experience,
    reason,
    createdAt: new Date().toISOString()
  };

  db.volunteers.push(newVolunteer);
  writeDb(db);
  res.status(201).json({ message: 'Volunteer application saved successfully.', volunteer: newVolunteer });
});

// Donations
app.get('/api/donations', (req, res) => {
  const db = readDb();
  res.json(db.donations);
});

app.post('/api/donations', (req, res) => {
  const { name, email, amount, method } = req.body;
  const numAmount = Number(amount);
  if (!name || !email || isNaN(numAmount) || numAmount < 1 || numAmount > 1000000) {
    return res.status(400).json({ error: 'Please enter valid donor details and an amount from ₹1 to ₹10,00,000.' });
  }

  const db = readDb();
  const newDonation = {
    id: Date.now().toString(),
    name,
    email,
    amount: numAmount,
    method: method || 'Demo pledge',
    status: 'Demo pledge — unpaid',
    createdAt: new Date().toISOString()
  };

  db.donations.push(newDonation);
  writeDb(db);
  res.status(201).json({ message: 'Donation pledge recorded.', donation: newDonation });
});

// Admin Login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'Admin@123') {
    return res.json({ success: true, message: 'Login successful' });
  }
  return res.status(401).json({ success: false, message: 'Incorrect username or password.' });
});

app.listen(PORT, () => {
  console.log(`HopeConnect Backend API Server running on port ${PORT}`);
});

