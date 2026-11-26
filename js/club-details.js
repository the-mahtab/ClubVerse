const details = document.querySelector("#club-details");
const about = document.querySelector("#about-club");
const param = new URLSearchParams(document.location.search);
const page = param.get("page");
const currentUserId = localStorage.getItem("currentUserId");

clubDetails();
const join = document.querySelector("#join");

if (join) {
  join.addEventListener("click", () => {
    if (currentUserId) {
      if (localStorage.getItem("admin")) {
        alert("admin cannot join a club");
      } else {
        const memberships = getData("memberships");
        const request = {
          id: Math.max(...memberships.map((m) => m.id)) + 1,
          userId: Number(currentUserId),
          clubId: page,
          status: "pending",
          date: new Date().toLocaleDateString(),
        };

        memberships.push(request);
        saveData("memberships", memberships);
        window.location.reload();
      }
    } else {
      alert("please login to join a club");
    }
  });
}

function clubDetails() {
  let btn = document.createElement("button");
  const clubs = getData("clubs");
  const memberships = getData("memberships");
  for (const club of clubs) {
    if (club.id === page) {
      details.innerHTML = `
            <div class="img">
          <img src="images/${page}.png" alt="${page} club">
        </div>
        <div class="club-info">
          <h2 class="p-1">${club.name}</h2>
          <p class="p-2">${club.category}</p>
          <p class="p-3">${club.description}</p>
          <p class="p-4">Members: <span>${totalMembers(club.id)}</span></p>
          <p class="p-5">Activities: <span>${club.activities.join(", ")}</span></p>
        </div>
        `;

      const admin = localStorage.getItem("admin");
      let membership = null;
      if (!admin) {
        membership = memberships.find(
          (m) => m.userId == currentUserId && m.clubId === club.id,
        );
      }

      if (!membership) {
        btn.id = "join";
        btn.textContent = "Join Club";
      } else if (membership.status === "approved") {
        btn.id = "joined";
        btn.textContent = "Joined";
      } else {
        btn.id = "join-pending";
        btn.textContent = "Approval pending";
      }

      details.children[1].append(btn);
      about.textContent = `${club.about}`;
      break;
    }
  }
}
