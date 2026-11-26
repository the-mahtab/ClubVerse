redirect();
window.addEventListener("pageshow", redirect);

// variables
const club = document.querySelector("#club");
const members = document.querySelector(".members");
const pending = document.querySelector(".pendin");
const approvedMembers = document.querySelector("#approved-container");
const pendingMembers = document.querySelector("#pending-container");
const pendingRequests = document.querySelector(".pr");
const appMembers = document.querySelector("#members");
const penMembers = document.querySelector("#search");
const overlay = document.querySelector(".overlay");
const btnContainer = document.querySelector(".btn-container");
const confirmation = document.querySelector("#confirmation");
const popup1 = document.querySelector(".popup-1");
const popup2 = document.querySelector(".popup-2");
const logout = document.querySelector("#log-out");
let membershipIdx = null;

renderClubOption();
updateStats(club.value);

logout.addEventListener("click", logOut);

const pendingRows = document.querySelectorAll(".row");

btnContainer.addEventListener("click", (e) => {
  const memberships = getData("memberships");
  if (e.target.id === "no") {
    overlay.style.display = "none";
  } else if (e.target.id === "yes") {
    memberships.splice(membershipIdx, 1);
    popup1.style.display = "none";
    popup2.style.display = "block";
    setTimeout(() => {
      overlay.style.display = "none";
      popup1.style.display = "block";
      popup2.style.display = "none";
      saveData("memberships", memberships);
      updateStats(club.value);
    }, 1500);
  }
});

// pendingRows.forEach((row) => {
pendingMembers.addEventListener("click", (e) => {
  const memberships = getData("memberships");
  const users = getData("users");

  if (e.target.className === "approve" || e.target.className === "reject") {
    let stdId =
      e.target.parentElement.previousElementSibling.previousElementSibling
        .textContent;
    let id = null;

    for (const { userId, studentId } of users) {
      if (studentId === stdId) {
        id = userId;
        break;
      }
    }

    for (let i = memberships.length - 1; i >= 0; i--) {
      if (memberships[i].userId === id) {
        if (e.target.className === "approve") {
          memberships[i].status = "approved";
          memberships[i].date = new Date().toLocaleDateString();
          saveData("memberships", memberships);
          updateStats(club.value);
          break;
        } else if (e.target.className === "reject") {
          membershipIdx = i;
          overlay.style.display = "flex";
          break;
        }
      }
    }
  }
});
// });

function renderClubOption() {
  const clubs = getData("clubs");
  const fragment = document.createDocumentFragment();
  for (const { id, name } of clubs) {
    const option = new Option(name, id);
    fragment.append(option);
  }

  club.append(fragment);
}


function getStats(clubId) {
  const stats = { approved: new Map(), pending: new Map() };
  const memberships = getData("memberships");

  for (const { userId, clubId: id, status, date } of memberships) {
    if (id === clubId) {
      if (status === "approved") {
        stats.approved.set(userId, date);
      } else if (status === "pending") {
        stats.pending.set(userId, date);
      }
    }
  }

  return stats;
}

function updateStats(clubId) {
  const stats = getStats(clubId);
  const users = getData("users");
  let approvedFragment = document.createDocumentFragment();
  let pendingFragment = document.createDocumentFragment();

  members.textContent = stats.approved.size;
  pending.textContent = stats.pending.size;

  for (const user of users) {
    if (stats.approved.has(user.userId)) {
      approvedFragment.append(
        createRow(
          user.name,
          user.studentId,
          user.email,
          stats.approved.get(user.userId),
        ),
      );
    } else if (stats.pending.has(user.userId)) {
      pendingFragment.append(
        createRow(
          user.name,
          user.studentId,
          "",
          stats.pending.get(user.userId),
        ),
      );
    }
  }

  approvedMembers.replaceChildren(approvedFragment);
  pendingMembers.replaceChildren(pendingFragment);
  pendingRequests.textContent = `${stats.pending.size} pending`;
}


appMembers.addEventListener("input", () => {
  let query = appMembers.value;
  searchTable(club.value, query.trim().toLowerCase(), "approved");
});

penMembers.addEventListener("input", () => {
  let query = penMembers.value;
  searchTable(club.value, query.trim().toLowerCase(), "pending");
});

function searchTable(clubId, query, id) {
  const users = getData("users");
  const stats = getStats(clubId);
  let filteredUser = [];
  let fragment = document.createDocumentFragment();

  if (id === "pending") {
    for (const user of users) {
      if (
        user.name.toLowerCase().includes(query) ||
        user.studentId.toLowerCase().includes(query)
      ) {
        if (stats.pending.has(user.userId)) {
          filteredUser.push(user);
        }
      }
    }

    for (const user of filteredUser) {
      fragment.append(
        createRow(
          user.name,
          user.studentId,
          "",
          stats.pending.get(user.userId),
        ),
      );
    }

    pendingMembers.replaceChildren(fragment);
  } else if (id === "approved") {
    for (const user of users) {
      if (
        user.name.toLowerCase().includes(query) ||
        user.studentId.toLowerCase().includes(query)
      ) {
        if (stats.approved.has(user.userId)) {
          filteredUser.push(user);
        }
      }
    }

    for (const user of filteredUser) {
      fragment.append(
        createRow(
          user.name,
          user.studentId,
          user.email,
          stats.approved.get(user.userId),
        ),
      );
    }

    approvedMembers.replaceChildren(fragment);
  }
}

function createCell(value) {
  const cell = document.createElement("td");
  cell.textContent = value ?? "";
  return cell;
}

function createRow(name, studentId, email = "", date) {
  let row = document.createElement("tr");
  let [day, month, year] = date.split("/");
  let d = new Date(year, month - 1, day);
  let fomrmattedDate = d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  if (email) {
    row.append(
      createCell(name),
      createCell(studentId),
      createCell(email),
      createCell(fomrmattedDate),
    );
  } else {
    let el = document.createElement("td");
    el.innerHTML = `
        <button class="approve">Approve</button>
        <button class="reject">Reject</button>
    `;
    row.setAttribute("class", "row");
    row.append(
      createCell(name),
      createCell(studentId),
      createCell(fomrmattedDate),
      el,
    );
  }

  return row;
}

club.addEventListener("change", () => {
  appMembers.value = "";
  penMembers.value = "";
  updateStats(club.value);
});



