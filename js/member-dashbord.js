window.addEventListener("pageshow", redirect);

// Get all required datasets
const users = getData("users");
const clubs = getData("clubs");
const memberships = getData("memberships");
const events = getData("events");
const registrations = getData("registrations");
const currentUserId = getData("currentUserId");

// Find the currently logged-in user
const currentUser = users.find((user) => user.userId === currentUserId);

// HTML elements
const userHeading = document.querySelector(".page-heading h1");
const statNumbers = document.querySelectorAll(".stats .card strong");
const statDescriptions = document.querySelectorAll(".stats .card small");
const membershipContainer = document.querySelector(".section .grid.two");
const eventsSection = document.querySelector("main > section.card.inside");
const logout = document.querySelector("#log-out");

logout.addEventListener("click", logOut);

// Show a message if the user is not logged in or cannot be found
if (!currentUser) {
  if (userHeading) {
    userHeading.textContent = "User not found";
  }

  if (membershipContainer) {
    membershipContainer.innerHTML =
      "<p class='muted'>Please log in to view your memberships.</p>";
  }

  if (eventsSection) {
    eventsSection.querySelectorAll(".event-row").forEach((row) => row.remove());

    eventsSection.insertAdjacentHTML(
      "beforeend",
      "<p class='muted'>Please log in to view your registered events.</p>",
    );
  }
} else {
  // Display the user's name
  userHeading.textContent = `Hey, ${currentUser.name.split(" ")[0]} 👋`;

  // Get this user's memberships
  const userMemberships = memberships.filter(
    (membership) => membership.userId === currentUserId,
  );

  const approvedRequests = userMemberships.filter(
    (memberships) => memberships.status === "approved",
  );

  // Get this user's pending membership requests
  const pendingRequests = userMemberships.filter(
    (membership) => membership.status === "pending",
  );

  // Get this user's event registrations
  const userRegistrations = registrations.filter(
    (registration) => registration.userId === currentUserId,
  );

  // Get the events registered by this user
  const registeredEvents = userRegistrations
    .map((registration) =>
      events.find((event) => event.eventId === registration.eventId),
    )
    .filter((event) => event);

  // Convert a date from DD/MM/YYYY to a Date object
  function convertDate(dateString) {
    const [day, month, year] = dateString.split("/");
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  // Count only events that have not taken place yet
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvents = registeredEvents.filter(
    (event) => convertDate(event.date) >= today,
  );

  // Update dashboard statistics
  statNumbers[0].textContent = String(approvedRequests.length).padStart(2, "0");
  statNumbers[1].textContent = String(pendingRequests.length).padStart(2, "0");
  statNumbers[2].textContent = String(upcomingEvents.length).padStart(2, "0");

  statDescriptions[0].textContent = "Joined";
  statDescriptions[1].textContent = "Waiting for review";
  statDescriptions[2].textContent = "Upcoming events";

  // Display this user's club memberships
  if (userMemberships.length === 0) {
    membershipContainer.innerHTML =
      "<p class='muted'>You haven't joined or requested any clubs yet.</p>";
  } else {
    membershipContainer.innerHTML = "";

    for (const membership of userMemberships) {
      const club = clubs.find((club) => club.id === membership.clubId);

      if (!club) {
        continue;
      }

      const statusClass =
        membership.status === "approved" ? "approved" : "pending";

      const statusText =
        membership.status === "approved" ? "Approved" : "Pending approval";

      membershipContainer.innerHTML += `
        <article class="card inside membership">
          <div>
            <h3>${club.name}</h3>
            <p class="muted">${club.category}</p>
            <span class="status ${statusClass}">${statusText}</span>
            <a href="club-details.html?page=${club.id}">View club ↗</a>
          </div>
        </article>
      `;
    }
  }

  // Convert 24-hour time to 12-hour time
  function formatTime(timeString) {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();

    date.setHours(Number(hours), Number(minutes));

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  // Display this user's registered events
  if (eventsSection) {
    eventsSection.querySelectorAll(".event-row").forEach((row) => row.remove());

    if (registeredEvents.length === 0) {
      eventsSection.insertAdjacentHTML(
        "beforeend",
        "<p class='muted'>You haven't registered for any events yet.</p>",
      );
    } else {
      for (const event of registeredEvents) {
        const club = clubs.find((club) => club.id === event.clubId);
        const eventDate = convertDate(event.date);

        const day = String(eventDate.getDate()).padStart(2, "0");

        const month = eventDate
          .toLocaleString("en-US", { month: "short" })
          .toUpperCase();

        const clubName = club ? club.name : "Unknown club";

        eventsSection.insertAdjacentHTML(
          "beforeend",
          `
            <div class="event-row">
              <div class="date">
                <b>${day}</b>
                <small>${month}</small>
              </div>
              <div class="event-info">
                <h3>${event.name}</h3>
                <p class="muted">${clubName} · ${formatTime(event.time)}</p>
                <p>Location: <span class="muted">${event.location}</span></p>
              </div>
            </div>
          `,
        );
      }
    }
  }
}
