function getData(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function cleanData(data, decide) {
  let dataArr = data.trim().toLowerCase().split(" ");
  dataArr = dataArr.filter((word) => word);
  if (dataArr.length) {
    dataArr[0] = dataArr[0][0].toUpperCase() + dataArr[0].slice(1);
  }
  if (decide) {
    dataArr = dataArr.map((word) => word[0].toUpperCase() + word.slice(1));
  }
  return dataArr.join(" ");
}

function totalMembers(clbId) {
  let members = 0;
  const memberships = getData("memberships");
  for (const { clubId: id, status } of memberships) {
    if (id === clbId) {
      if (status === "approved") {
        members++;
      }
    }
  }
  return members;
}

function logOut() {
  const admin = localStorage.getItem("admin");
  localStorage.removeItem("currentUserId");
  if (admin) {
    localStorage.removeItem("admin");
  }
  window.location.href = "index.html";
}

function resetData() {
  saveData("clubs", clubs);
  saveData("events", events);
  saveData("memberships", memberships);
  saveData("registrations", registrations);
  saveData("users", users);
  localStorage.removeItem(("currentUserId"));
  localStorage.removeItem("admin");
}

function loadData(key, value) {
  if (localStorage.getItem(key) === null) {
    saveData(key, value);
  }
}

function redirect() {
  const currentUserId = localStorage.getItem("currentUserId");
  if (!currentUserId) {
    window.location.replace("index.html");
  }
}

