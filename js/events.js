const links = document.querySelector(".links");

const currentUserId = localStorage.getItem("currentUserId");

if (currentUserId) {
  let admin = localStorage.getItem("admin");

  if (admin) {
    links.innerHTML = `
      <a href="index.html">Home</a>
      <a href="admin-dashboard.html">Dashboard</a>
    `;
  } else {
    links.innerHTML = `
      <a href="index.html">Home</a>
      <a href="member-dashboard.html">Dashboard</a>
      <a href="profile.html">Profile</a>
    `;
  }
} else {
  links.innerHTML = `
    <a href="index.html">Home</a>
    <a href="register.html">Register</a>
    <a href="login.html">Login</a>
  `;
}

(function () {
  const searchInput = document.getElementById("search");
  const clubSelect = document.getElementById("club");
  const dateSelect = document.getElementById("date");
  const searchBtn = document.getElementById("search-btn");
  const resetBtn = document.getElementById("reset-btn");
  const eventsGrid = document.getElementById("events-grid");

  // Fetch data from localStorage
  const clubsData = getData("clubs");
  const eventsData = getData("events");

  // Populate club dropdown
  clubSelect.innerHTML = '<option value="all">All clubs</option>';

  clubsData.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = c.name;
    clubSelect.appendChild(opt);
  });

  // Convert DD/MM/YYYY into a Date object
  function parseSlashDate(dateStr) {
    const [day, month, year] = (dateStr || "").split("/").map(Number);

    if (!day || !month || !year) return null;

    return new Date(year, month - 1, day);
  }

  // Register the logged-in user for an event
  function registerForEvent(eventId) {
    const loggedInUserId = localStorage.getItem("currentUserId");

    // Case 1: User is not logged in
    if (!loggedInUserId) {
      alert("pls login to register");
      return;
    }

    if (localStorage.getItem("admin")) {
        alert("Admins cannot register for events.");
        return;
    }

    // Convert currentUserId into a number
    const userId = Number(loggedInUserId);

    // Fetch memberships and registrations
    const memberships = getData("memberships");
    const registrations = getData("registrations");

    // Find the selected event
    const event = eventsData.find(
      (ev) => String(ev.eventId) === String(eventId)
    );

    if (!event) {
      alert("Event not found.");
      return;
    }

    // Check whether the user has approved membership in this event's club
    const hasApprovedMembership = memberships.some(
      (membership) =>
        Number(membership.userId) === userId &&
        membership.clubId === event.clubId &&
        membership.status === "approved"
    );

    // Case 2: User has not joined the club or membership is pending
    if (!hasApprovedMembership) {
      alert("pls register in the club first");
      return;
    }

    // Check whether the user is already registered for this event
    const alreadyRegistered = registrations.some(
      (registration) =>
        Number(registration.userId) === userId &&
        String(registration.eventId) === String(event.eventId)
    );

    if (alreadyRegistered) {
      alert("You are already registered for this event.");
      return;
    }

    // Generate the next registration ID
    const id = registrations.length
      ? Math.max(...registrations.map((r) => r.id)) + 1
      : 1;

    // Generate registration date in DD/MM/YYYY format
    const now = new Date();

    const registeredAt = `${String(now.getDate()).padStart(2, "0")}/${String(
      now.getMonth() + 1
    ).padStart(2, "0")}/${now.getFullYear()}`;

    // Create a new registration object
    registrations.push({
      id,
      userId,
      eventId: event.eventId,
      registeredAt,
    });

    // Save updated registrations in localStorage
    saveData("registrations", registrations);

    alert("Successfully registered for the event!");
  }

  function renderAll() {
    const q = (searchInput.value || "").trim().toLowerCase();
    const selectedClub = clubSelect.value;
    const selectedDate = dateSelect.value;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const filtered = eventsData.filter((ev) => {
      const club = clubsData.find((c) => c.id === ev.clubId);
      const clubName = club ? club.name.toLowerCase() : "";

      const evDate = parseSlashDate(ev.date);

      const matchClub =
        selectedClub === "all" || ev.clubId === selectedClub;

      let matchDate = true;

      if (selectedDate === "this-week") {
        matchDate = Boolean(
          evDate && evDate >= weekStart && evDate <= weekEnd
        );
      } else if (selectedDate === "this-month") {
        matchDate = Boolean(
          evDate &&
          evDate.getFullYear() === today.getFullYear() &&
          evDate.getMonth() === today.getMonth()
        );
      }

      const matchSearch =
        !q ||
        ev.name.toLowerCase().includes(q) ||
        ev.description.toLowerCase().includes(q) ||
        ev.location.toLowerCase().includes(q) ||
        clubName.includes(q);

      return matchClub && matchDate && matchSearch;
    });

    eventsGrid.innerHTML = filtered.length
      ? filtered
          .map((ev) => {
            const club = clubsData.find((c) => c.id === ev.clubId) || {
              name: ev.clubId,
              badge: "★",
              theme: "purple",
            };

            const [day, month] = ev.date.split("/");

            const months = [
              "",
              "JAN",
              "FEB",
              "MAR",
              "APR",
              "MAY",
              "JUN",
              "JUL",
              "AUG",
              "SEP",
              "OCT",
              "NOV",
              "DEC",
            ];

            return `
              <article class="card event-card">
                <div class="event-banner ${club.theme || "purple"}">
                  <span class="tag">${club.name.toUpperCase()}</span>
                  <b>${club.badge || "★"}</b>
                </div>

                <div class="event-content">
                  <div class="date">
                    <b>${day}</b>
                    <small>${months[Number(month)] || ""}</small>
                  </div>

                  <div>
                    <h2>${ev.name}</h2>
                    <p class="muted">
                      ${ev.date} · ${ev.time} · ${ev.location}
                    </p>
                    <p>${ev.description}</p>
                    <p class="event-rule">Club membership required</p>

                    <button
                      class="btn small register-btn"
                      type="button"
                      data-event-id="${ev.eventId}"
                    >
                      Register
                    </button>
                  </div>
                </div>
              </article>
            `;
          })
          .join("")
      : `
        <div class="empty-state wide">
          <h3>No matching events found</h3>
          <p class="muted">Try another keyword or click Reset.</p>
        </div>
      `;
  }

  // Event listeners
  eventsGrid.addEventListener("click", (event) => {
    const registerButton = event.target.closest(".register-btn");

    if (!registerButton) return;

    registerForEvent(registerButton.dataset.eventId);
  });

  searchBtn.addEventListener("click", renderAll);
  searchInput.addEventListener("input", renderAll);
  clubSelect.addEventListener("change", renderAll);
  dateSelect.addEventListener("change", renderAll);

  resetBtn.addEventListener("click", () => {
    searchInput.value = "";
    clubSelect.value = "all";
    dateSelect.value = "any";

    renderAll();
  });

  renderAll();
})();
