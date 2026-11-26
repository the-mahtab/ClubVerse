resetData();

loadData("users", users);
loadData("admins", admins);
loadData("clubs", clubs);
loadData("memberships", memberships);
loadData("events", events);
loadData("registrations", registrations);

const cards = document.querySelector(".cards");
const currentUserId = localStorage.getItem("currentUserId");
clubsInfo();
const details = document.querySelectorAll(".view-details");
const nav = document.querySelector(".navigation");
const cont = document.querySelector(".container.hidden");

if (currentUserId) {
  let admin = localStorage.getItem("admin");
  if (admin) {
    nav.innerHTML = `
      <a href="#clubs">Clubs</a>  
          <a href="admin-dashboard.html">Dashboard</a>
          <a href="events.html">Events</a>
          <a id="log-out">Log out</a>
    `;
  } else {
    nav.innerHTML = `
          <a href="#clubs">Clubs</a>
          <a href="member-dashboard.html">Dashboard</a>
          <a href="events.html">Events</a>
          <a id="log-out">Log out</a>
  `;
  }
  const logout = document.querySelector("#log-out");
  logout.addEventListener("click", logOut);
  cont.classList.add("hidden");
} else {
  nav.innerHTML = `
          <a href="#clubs">Clubs</a>  
            <a href="login.html">Login</a>
          <a href="register.html" class="register">Register</a>

  `;
  cont.classList.remove("hidden");
}

details.forEach((detail) => {
  detail.addEventListener("click", () => {
    window.location.href = `club-details.html?page=${detail.id}`;
  });
});

function clubsInfo() {
  let fragment = document.createDocumentFragment();
  const clubs = getData("clubs");
  for (const club of clubs) {
    let card = document.createElement("div");
    card.setAttribute("class", "card");
    let members = totalMembers(club.id);
    let call = null;
    if (members === 1) {
      call = `${members} member`;
    } else {
      call = `${members} members`;
    }
    card.innerHTML = `
            <div class="img">
    <img
      src="images/${club.id}.png"
      alt="${club.name.toLowerCase()}"
    />
  </div>
  <div class="main-info">
    <div class="info">
      <span>${club.category}</span>
      <h2>${club.name}</h2>
      <p>
        ${club.description}
         </p>
    </div>
    <div class="foot-info">
      <p>${call}</p>
      <a id="${club.id}" class="view-details">View details ↗</a>
    </div>
  </div>
        `;
    fragment.append(card);
  }
  cards.replaceChildren(fragment);
}

