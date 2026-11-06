// Basic JavaScript for third-semester students.
// Demo data is saved only in this browser.
function loadData(key) {
    try {
        const value = JSON.parse(localStorage.getItem(key) || "[]");
        return Array.isArray(value) ? value : [];
    } catch (error) {
        return [];
    }
}
let volunteers = loadData("ngo_volunteers");
let donations = loadData("ngo_donations");
const events = [
    { title: "Tree Plantation Drive", date: "15 November 2026", place: "Community Park", description: "Plant trees with other volunteers." },
    { title: "Education Awareness Camp", date: "22 November 2026", place: "Community Centre", description: "Help students with learning activities." },
    { title: "Health Awareness Program", date: "5 December 2026", place: "Public Hall", description: "Share information about health and hygiene." }
];
function addCell(row, value) {
    const cell = document.createElement("td");
    cell.textContent = value;
    row.appendChild(cell);
}
function displayEvents() {
    const list = document.getElementById("eventList");
    if (!list) return;
    events.forEach(function(event) {
        const card = document.createElement("article");
        card.className = "card";
        const heading = document.createElement("h3");
        heading.textContent = event.title;
        const details = document.createElement("p");
        details.textContent = event.date + " • " + event.place;
        const description = document.createElement("p");
        description.textContent = event.description;
        const link = document.createElement("a");
        link.href = "volunteer.html";
        link.textContent = "Volunteer →";
        card.append(heading, details, description, link);
        list.appendChild(card);
    });
}
const volunteerForm = document.getElementById("volunteerForm");
if (volunteerForm) {
    volunteerForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const get = id => document.getElementById(id).value.trim();
        const name = get("volName"), email = get("volEmail"), phone = get("volPhone");
        const age = Number(get("volAge")), city = get("volCity");
        const interest = get("volInterest"), skills = get("volSkills");
        const availability = get("volAvailability"), experience = get("volExperience");
        const reason = get("volReason");
        const agreed = document.getElementById("volAgree").checked;
        if (!name || !email || !/^[0-9]{10}$/.test(phone) || age < 16 || age > 100 ||
            !city || !interest || !skills || !availability || !experience || reason.length < 30 || !agreed) {
            alert("Please complete all required fields. Your reason must be at least 30 characters.");
            return;
        }
        volunteers.push({ name, email, phone, age, city, interest, skills, availability, experience, reason });
        localStorage.setItem("ngo_volunteers", JSON.stringify(volunteers));
        document.getElementById("volunteerMessage").textContent = "Thank you! Your volunteer application was saved in this browser.";
        volunteerForm.reset();
    });
}
const donationForm = document.getElementById("donationForm");
if (donationForm) {
    donationForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const name = document.getElementById("donorName").value.trim();
        const email = document.getElementById("donorEmail").value.trim();
        const amount = Number(document.getElementById("donationAmount").value);
        const method = document.querySelector('input[name="method"]:checked').value;
        const app = document.querySelector('input[name="upiApp"]:checked').value;
        const methodLabel = method === "upi" ? app + " (UPI)" : method === "qr" ? "QR demo" : "Card demo";
        if (!name || !email || !Number.isInteger(amount) || amount < 1 || amount > 1000000) {
            alert("Please enter valid donor details and an amount from ₹1 to ₹10,00,000.");
            return;
        }
        donations.push({ name, email, amount, method: methodLabel, status: "Demo pledge — unpaid" });
        localStorage.setItem("ngo_donations", JSON.stringify(donations));
        document.getElementById("resultText").textContent =
            name + ", your ₹" + amount.toLocaleString("en-IN") + " pledge via " + methodLabel + " has been recorded.";
        document.getElementById("donationResult").hidden = false;
        document.getElementById("donationResult").scrollIntoView({ behavior: "smooth" });
    });
}
function updateDashboard() {
    const count = document.getElementById("totalVolunteers");
    if (!count) return;
    count.textContent = volunteers.length;
    document.getElementById("totalEvents").textContent = events.length;
    document.getElementById("totalDonations").textContent = donations.length;
    const volunteerTable = document.getElementById("volunteerTable");
    volunteerTable.innerHTML = "";
    volunteers.forEach(function(person) {
        const row = document.createElement("tr");
        [person.name, person.email, person.phone, person.age || "—", person.city || "—",
         person.interest, person.skills || "—", person.availability || "—",
         person.experience || "—", person.reason || "Not provided (older record)"].forEach(function(value) {
            addCell(row, value);
        });
        volunteerTable.appendChild(row);
    });
    const donationTable = document.getElementById("donationTable");
    donationTable.innerHTML = "";
    donations.forEach(function(pledge) {
        const row = document.createElement("tr");
        [pledge.name, pledge.email, "₹" + Number(pledge.amount).toFixed(2)].forEach(function(value) {
            addCell(row, value);
        });
        donationTable.appendChild(row);
    });
}

// Demo-only login. Credentials in JavaScript are NOT secure authentication.
const adminLoginForm = document.getElementById("adminLoginForm");
if (adminLoginForm) {
    const loginBox = document.getElementById("adminLoginBox");
    const dashboard = document.getElementById("adminDashboard");
    function showAdmin(isLoggedIn) {
        loginBox.hidden = isLoggedIn;
        dashboard.hidden = !isLoggedIn;
        if (isLoggedIn) updateDashboard();
    }
    showAdmin(sessionStorage.getItem("ngo_demo_admin") === "yes");
    adminLoginForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const username = document.getElementById("adminUsername").value.trim();
        const password = document.getElementById("adminPassword").value;
        if (username === "admin" && password === "Admin@123") {
            sessionStorage.setItem("ngo_demo_admin", "yes");
            document.getElementById("loginMessage").textContent = "";
            adminLoginForm.reset();
            showAdmin(true);
        } else {
            document.getElementById("loginMessage").textContent = "Incorrect username or password.";
        }
    });
    document.getElementById("logoutBtn").addEventListener("click", function() {
        sessionStorage.removeItem("ngo_demo_admin");
        showAdmin(false);
    });
}
displayEvents();
updateDashboard();

// Additional checkout interactions for the Donate page.
const amountInput = document.getElementById("donationAmount");
if (amountInput) {
    const formatMoney = amount => "₹" + Number(amount || 0).toLocaleString("en-IN");
    const methodRadios = document.querySelectorAll('input[name="method"]');
    const appRadios = document.querySelectorAll('input[name="upiApp"]');
    const panels = { upi: "upiPanel", qr: "qrPanel", card: "cardPanel" };

    function refreshCheckout() {
        const amount = Number(amountInput.value);
        const display = formatMoney(amount);
        document.getElementById("summaryAmount").textContent = display;
        document.getElementById("summaryTotal").textContent = display;
        document.getElementById("buttonAmount").textContent = display;
        document.querySelectorAll(".amount-choice").forEach(button => {
            button.classList.toggle("selected", Number(button.dataset.amount) === amount);
        });
        const method = document.querySelector('input[name="method"]:checked').value;
        Object.keys(panels).forEach(key => {
            document.getElementById(panels[key]).hidden = key !== method;
        });
        const app = document.querySelector('input[name="upiApp"]:checked').value;
        const names = { upi: app + " (UPI)", qr: "Scan QR (demo)", card: "Card (demo)" };
        document.getElementById("summaryMethod").textContent = names[method];
    }

    document.querySelectorAll(".amount-choice").forEach(button => {
        button.addEventListener("click", () => {
            amountInput.value = button.dataset.amount;
            refreshCheckout();
        });
    });
    amountInput.addEventListener("input", refreshCheckout);
    methodRadios.forEach(radio => radio.addEventListener("change", refreshCheckout));
    appRadios.forEach(radio => radio.addEventListener("change", refreshCheckout));

    document.getElementById("copyUpi").addEventListener("click", async () => {
        const value = document.getElementById("demoUpi").textContent;
        try {
            await navigator.clipboard.writeText(value);
            document.getElementById("copyMessage").textContent = "Demo ID copied (not valid for payment).";
        } catch (error) {
            document.getElementById("copyMessage").textContent = "Select the demo ID above to copy it manually.";
        }
    });

    document.getElementById("newDonation").addEventListener("click", () => {
        document.getElementById("donationResult").hidden = true;
        donationForm.reset();
        amountInput.value = 500;
        refreshCheckout();
        document.getElementById("donationForm").scrollIntoView({ behavior: "smooth" });
    });
    refreshCheckout();
}
