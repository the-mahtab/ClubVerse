redirect()
if (!currentUserId) {
    window.location.replace("index.html");
}

const param = new URLSearchParams(window.location.search);
const page = param.get("page");
const id = param.get("id");

// club el
const clubForm = document.querySelector("#club-form");
const clbForm = document.querySelector(".club");
const clubName = document.querySelector("#name");
const category = document.querySelector("#category");
const description = document.querySelector("#description");
const activities = document.querySelector("#activities");
const about = document.querySelector("#about");
let clbIdx = null;

// event el
const evtForm = document.querySelector(".event");
const eventForm = document.querySelector("#event-form");
const clubId = document.querySelector("#club-id");
const evtName = document.querySelector("#evt-name");
const date = document.querySelector("#date");
const time = document.querySelector("#time");
const location = document.querySelector("#location");
const desc = document.querySelector("#evt-description");
let evtIdx = null;

if (page === "club") {
    clbForm.classList.remove("hidden");
    evtForm.classList.add("hidden");
} else if (page === "event") {
    clbForm.classList.add("hidden");
    evtForm.classList.remove("hidden");
}


function clubsHtml(clbId) {
    const clubs = getData("clubs");
    for (let i = clubs.length - 1; i >= 0; i--) {
        if (clubs[i].id === clbId) {
            clubName.value = clubs[i].name;
            category.value = clubs[i].category;
            description.value = clubs[i].description;
            activities.value = clubs[i].activities.join(", ");
            about.value = clubs[i].about;
            clbIdx = i;
            break;
        }
    }
}

clubsHtml(id);

clubForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (
        !clubName.value.trim() ||
        !category.value.trim() ||
        !description.value.trim() ||
        !activities.value.trim() ||
        !about.value.trim()
    ) {
        alert("please provide valid info");
        return;
    }

    // data cleaning

    let clbName = cleanData(clubName.value, 1);
    let clbCateg = cleanData(category.value, 1);
    let desc = cleanData(description.value);
    let actvt = activities.value.split(", ").map(act => cleanData(act));
    let abt = cleanData(about.value);

    
    const club = {
        id: `${id}`,
        name: clbName,
        category: clbCateg,
        description: desc,
        about: abt,
        activities: actvt
        
    }

    let clubs = getData("clubs");

    clubs.splice(clbIdx, 1, club);
    saveData("clubs", clubs);
    alert("club info edited successfully");
})

function eventsHtml(evtId) {
    const events = getData("events");
    for (let i = events.length - 1; i >= 0; i--) {
        if (events[i].eventId == evtId) {
            clubId.value = events[i].clubId;
            evtName.value = events[i].name;
            date.value = events[i].date;
            time.value = events[i].time;
            location.value = events[i].location;
            desc.value = events[i].description;
            evtIdx = i;
        }
    }
}

eventsHtml(id);

eventForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (
        !clubId.value.trim() ||
        !evtName.value.trim() ||
        !date.value.trim() ||
        !time.value.trim() ||
        !location.value.trim() ||
        !desc.value.trim()
    ) {
        alert("please provide valid info");
        return;
    }

    if (!isDateValid(date.value.trim())) {
        alert("please provide valid date and in this format: (dd/mm/yyyy)");
        return;
    }

    // data cleaning

    let clbId = cleanData(clubId.value).toLowerCase();
    let eventName = cleanData(evtName.value, 1);
    let evtDate = date.value.trim();
    let evtTime = time.value;
    let evtLocation = cleanData(location.value, 1);
    let evtDesc = cleanData(desc.value);

    const event = {
        eventId: Number(id),
        clubId: clbId,
        name: eventName,
        date: evtDate,
        time: evtTime,
        location: evtLocation,
        description: evtDesc
    }

    let events = getData("events");

    events.splice(evtIdx, 1, event);
    saveData("events", events);
    alert("event edited successfully");
})

function isDateValid(date) {
    const regex = /^\d{2}\/(\d{2})\/(\d{4})$/;
    if (!regex.test(date)) return false;

    const [day, month, year] = date.split("/");
    const d = new Date(year, month-1, day);

    return (
        d.getDate() === Number(day) &&
        d.getMonth() === Number(month) - 1 &&
        d.getFullYear() === Number(year)
    );
}


