let records = JSON.parse(localStorage.getItem("moodRecords")) || [];
let theme = localStorage.getItem("theme") || "dark";
document.body.className = theme;
document.getElementById("themeToggle").checked = theme === "light";

// Toggle Sidebar
function toggleSidebar() {
    let sb = document.getElementById("sidebar");
    sb.style.left = sb.style.left === "0px" ? "-270px" : "0px";
}

// Show pages
function showPage(page) {
    document.querySelectorAll(".page").forEach(p => p.style.display = "none");
    document.getElementById(page).style.display = "block";
    toggleSidebar();
    updateDashboard();
}

// Theme Toggle
function toggleTheme() {
    theme = theme === "dark" ? "light" : "dark";
    document.body.className = theme;
    localStorage.setItem("theme", theme);
}

// Add Record
function addRecord() {
    let mood = document.getElementById("mood").value;
    let habit = document.getElementById("habitName").value;
    let count = document.getElementById("habits").value;
    let notes = document.getElementById("notes").value;

    if (!habit) return alert("Enter habit!");

    const rec = {
        id: Date.now(),
        mood, habit, count, notes,
        date: new Date().toLocaleString()
    };

    records.push(rec);
    localStorage.setItem("moodRecords", JSON.stringify(records));
    displayRecords();
    showPage("recordsPage");
}

// List Records
function displayRecords() {
    let box = document.getElementById("records");
    box.innerHTML = "";
    records.forEach(r => {
        box.innerHTML += `
        <div class="record-card">
            <div>
                <h3>${r.habit}</h3>
                <p>${r.mood}</p>
                <p>Count: ${r.count}</p>
                <small>${r.date}</small>
            </div>
            <div>
                <button class="edit-btn" onclick="editRecord(${r.id})">Edit</button>
                <button class="delete-btn" onclick="deleteRecord(${r.id})">Delete</button>
            </div>
        </div>`;
    });
}

// Delete & Edit
function deleteRecord(id) {
    records = records.filter(x => x.id !== id);
    localStorage.setItem("moodRecords", JSON.stringify(records));
    displayRecords();
}

function editRecord(id) {
    let r = records.find(x => x.id === id);
    document.getElementById("mood").value = r.mood;
    document.getElementById("habitName").value = r.habit;
    document.getElementById("habits").value = r.count;
    document.getElementById("notes").value = r.notes;
    deleteRecord(id);
    showPage("addMood");
}

// Dashboard Chart
let moodChart = null;

function updateDashboard() {
    if (!records.length) {
        document.getElementById("latestMood").innerHTML = "<h3>Latest Mood</h3><p>No records</p>";
        document.getElementById("totalHabits").innerHTML = "<h3>Total Habits</h3><p>0</p>";
        return;
    }

    let last = records[records.length - 1];
    document.getElementById("latestMood").innerHTML = `
        <h3>Latest Mood</h3>
        <p>${last.mood}</p>
        <small>${last.date}</small>
    `;

    let total = records.reduce((t, r) => t + Number(r.count), 0);
    document.getElementById("totalHabits").innerHTML = `
        <h3>Total Habits Count</h3>
        <p>${total}</p>
    `;

    // Mood Count
    let moods = {};
    records.forEach(r => moods[r.mood] = (moods[r.mood] || 0) + 1);

    let ctx = document.getElementById("moodChart").getContext("2d");
    if (moodChart) moodChart.destroy();

    moodChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: Object.keys(moods),
            datasets: [{
                data: Object.values(moods),
                backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4caf50", "#ba68c8"]
            }]
        }
    });
}

// Profile Edit (simple)
function editProfile() {
    alert("Edit Profile feature coming soon!");
}

displayRecords();
updateDashboard();
