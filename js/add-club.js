

// club form elements
const clubForm = document.querySelector(".club-form");
const clbForm = document.querySelector("#club-form");
const category = document.querySelector("#category");
const clubActi = document.querySelector("#activities");
const id = document.querySelector("#clubId");
const name = document.querySelector("#name");
const description = document.querySelector("#description");
const about = document.querySelector("#about");

// event form elements
const eventForm = document.querySelector(".event-form");
const evtForm = document.querySelector("#event-form");
const location = document.querySelector("#location");
const eventName = document.querySelector("#event-name");
const eventId = document.querySelector("#event-id");
const eventDesc = document.querySelector("#event-desc");
const evtDate = document.querySelector("#event-date");
const evtTime = document.querySelector("#event-time");
const param = new URLSearchParams(window.location.search);
const page = param.get("page");

if (page === "club") {
  clubForm.classList.remove("hidden");
  eventForm.classList.add("hidden");
} else if (page === "event") {
  eventForm.classList.remove("hidden");
  clubForm.classList.add("hidden");
} else {
  clubForm.classList.add("hidden");
  eventForm.classList.add("hidden");
}


// saveData("clubs", clubs);
// console.log(localStorage.clubs);


clbForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (
    !(
      id.value.trim() &&
      name.value.trim() &&
      category.value.trim() &&
      description.value.trim() &&
      clubActi.value.trim() &&
      about.value.trim()
    )
  ) {
    alert("please provide valid info");
    return;
  }

  // data cleaning

  let clbId = cleanData(id.value).toLowerCase();
  let clbName = cleanData(name.value, 1);
  let clbCate = cleanData(category.value, 1);
  let desc = cleanData(description.value);
  let clbActvt = clubActi.value.split(", ").map((item) => cleanData(item));
  let clbabt = cleanData(about.value)

  const club = {
    id: clbId,
    name: clbName,
    category: clbCate,
    description: desc,
    about: clbabt,
    activities: clbActvt,
  };

  const clubs = getData("clubs");

  let duplicate = clubs.some(
    (clb) => clb.id === club.id || clb.name === club.name,
  );

  if (duplicate) {
    alert("club already exists");
    return;
  }

  clubs.push(club);
  saveData("clubs", clubs);
  alert("club created sucessfully");
  clbForm.reset();
});


evtForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (
    !eventId.value.trim() ||
    !eventName.value.trim() ||
    !location.value.trim() ||
    !eventDesc.value.trim()
  ) {
    alert("please provide valid information");
    return;
  }

  // data cleaning

  let [year, month, day] = evtDate.value.split("-");
  let date = new Date(year, month-1, day).toLocaleDateString();
  
  let clbId = cleanData(eventId.value).toLowerCase();
  let evtName = cleanData(eventName.value, 1);
  let eventDate = date;
  let eventTime = evtTime.value;
  let locat = cleanData(location.value);
  let desc = cleanData(eventDesc.value);

  const events = getData("events");
  const clubs = getData("clubs");

  // check club

  let clubExist = clubs.some((club) => club.id === clbId);

  if (!clubExist) {
    alert("Club doesn't exist");
    return;
  }

  let duplicate = events.some((evt) => evt.name === evtName);

  if (duplicate) {
    alert("event already exists");
    return;
  }

  const event = {
    eventId: Math.max(...events.map((evt) => evt.eventId)) + 1,
    clubId: clbId,
    name: evtName,
    date: eventDate,
    time: eventTime,
    location: locat,
    description: desc,
  };

  events.push(event);
  saveData("events", events);

  alert("event created sucessfully");
  evtForm.reset();
});

// function

