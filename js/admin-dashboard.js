redirect();
window.addEventListener("pageshow", redirect);

const totalMembers = document.querySelector("#total-members");
const totalClubs = document.querySelector("#total-clubs");
const totalPending = document.querySelector("#pending-requests");
const upcomingEvents = document.querySelector("#upcoming-events");
const eventTable = document.querySelector("#event-table");
const clubTable = document.querySelector("#club-table");
const clubBtn = document.querySelector(".club-btn");
const eventBtn = document.querySelector(".event-btn");
const removeContainer = document.querySelector(".hidden");
const btnContainer = document.querySelector(".btn-container");
const validation = document.querySelector(".validation");
const confirmation = document.querySelector(".confirmation");
const c = document.querySelectorAll(".c");
const ev = document.querySelectorAll(".e");
const events = document.querySelector(".events");
const logout = document.querySelector("#log-out");

let removeClubId = null;
let removeEventId = null;

totalCount();
updateClubDetails();
updateEventsDetails();

logout.addEventListener("click", logOut);

events.addEventListener("click", () => {
  window.location.href = "events.html?page=admin";
});

eventTable.addEventListener("click", (e) => {
  const el = e.target;
  removeEventId = el.parentElement.parentElement.children[0].id;
  if (el.className === "remove") {
    removeContainer.classList.remove("hidden");
    validation.classList.remove("h");
    confirmation.classList.add("h");
    c.forEach((s) => {
      s.style.display = "none";
    });
    ev.forEach((s) => {
      s.style.display = "contents";
    });
  }

  if (el.className === "edit") {
    window.location.href = `edit-club.html?page=event&id=${removeEventId}`;
  }
});

clubBtn.addEventListener("click", () => {
  window.location.href = "add-club.html?page=club";
});

eventBtn.addEventListener("click", () => {
  window.location.href = "add-club.html?page=event";
});

btnContainer.addEventListener("click", (e) => {
  const el = e.target;
  if (el.id === "no") {
    removeContainer.classList.add("hidden");
  } else if (el.id === "yes") {
    if (removeClubId) {
      removeClub(removeClubId);
      updateClubDetails();
      totalCount();
      updateEventsDetails();
      removeClubId = null;
    }

    if (removeEventId) {
      removeEvent(removeEventId);
      totalCount();
      updateEventsDetails();
      removeEventId = null;
    }

    validation.classList.add("h");
    confirmation.classList.remove("h");

    setTimeout(() => {
      removeContainer.classList.add("hidden");
    }, 2000);
  }
});

function removeEvent(evtId) {
  let events = getData("events");
  let registrations = getData("registrations");

  events = events.filter((event) => event.eventId != evtId);
  registrations = registrations.filter(
    (register) => register.eventId !== evtId,
  );

  saveData("events", events);
  saveData("registrations", registrations);
}

function removeClub(clbId) {
  let clubs = getData("clubs");
  let memberships = getData("memberships");
  let events = getData("events");
  let registrations = getData("registrations");

  clubs = clubs.filter((club) => club.id !== clbId);
  memberships = memberships.filter((member) => member.clubId !== clbId);
  events = events.filter((event) => event.clubId !== clbId);
  registrations = registrations.filter((register) => {
    return events.some((event) => event.eventId === register.eventId);
  });

  saveData("clubs", clubs);
  saveData("memberships", memberships);
  saveData("events", events);
  saveData("registrations", registrations);
}

clubTable.addEventListener("click", (e) => {
  const el = e.target;
  const clbId = el.parentElement.parentElement.children[0].id;
  if (el.className === "remove") {
    removeClubId = clbId;
    removeContainer.classList.remove("hidden");
    validation.classList.remove("h");
    confirmation.classList.add("h");
    c.forEach((s) => {
      s.style.display = "contents";
    });
    ev.forEach((s) => {
      s.style.display = "none";
    });
  }

  if (el.className === "edit") {
    window.location.href = `edit-club.html?page=club&id=${clbId}`;
  }
});

function totalCount() {
  const memberships = getData("memberships");
  const events = getData("events");
  // console.log(events);
  const clubs = getData("clubs");
  let members = 0;
  let pending = 0;
  for (const { status } of memberships) {
    if (status === "approved") {
      members++;
    } else {
      pending++;
    }
  }
  totalMembers.textContent = members;
  totalClubs.textContent = clubs.length;
  totalPending.textContent = pending;
  upcomingEvents.textContent = events.length;
}

function updateCount(id) {
  const memberships = getData("memberships");
  const count = { approved: 0, pending: 0 };
  for (const { clubId, status } of memberships) {
    if (clubId === id) {
      if (status === "approved") {
        count.approved++;
      } else {
        count.pending++;
      }
    }
  }
  return count;
}

function updateClubDetails() {
  let fragment = document.createDocumentFragment();
  const clubs = getData("clubs");
  for (const { id, name, category } of clubs) {
    let count = updateCount(id);
    let row = document.createElement("tr");
    row.innerHTML = `
      <td id="${id}">${name}</td>
      <td>${category}</td>
      <td>${count.approved}</td>
      <td>${count.pending}</td>
      <td>
        <button class="edit">Edit</button>
        <button class="remove">Remove</button>
      </td>
    `;
    fragment.append(row);
  }

  clubTable.replaceChildren(fragment);
}

function updateEventsDetails() {
  let fragment = document.createDocumentFragment();
  const events = getData("events");
  for (const event of events) {
    const name = event.name;
    const club = event.clubId.charAt(0).toUpperCase() + event.clubId.slice(1);
    const [day, month, year] = event.date.split("/");
    const formattedDate = formatedDate(year, month, day);
    const register = eventRegisters(event.eventId);

    const row = document.createElement("tr");
    row.innerHTML = `
        <td id="${event.eventId}">${name}</td>
        <td>${club} Club</td>
        <td>${formattedDate}</td>
        <td>${register}</td>
        <td>
            <button class="edit">EDIT</button>
            <button class="remove">REMOVE</button>
        <td>
    `;

    fragment.append(row);
  }

  eventTable.replaceChildren(fragment);
}

function formatedDate(year, month, day) {
  const date = new Date(year, month - 1, day);
  return `${date.getDate()} ${date.toLocaleString("en-US", { month: "short" })} ${date.getFullYear()}`;
}

function eventRegisters(eventId) {
  let totalRegisters = 0;
  const registrations = getData("registrations");
  for (const register of registrations) {
    if (register.eventId === eventId) {
      totalRegisters++;
    }
  }
  return totalRegisters;
}



