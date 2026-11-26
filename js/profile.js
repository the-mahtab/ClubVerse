redirect();
window.addEventListener("pageshow", redirect);

const logOut = document.querySelector("#log-out");

logOut.addEventListener("click", () => {
  localStorage.removeItem("currentUserId");
})



