const formm = document.querySelector("#register-form");
const fullName = document.querySelector("#name");
const sid = document.querySelector("#sid");
const email = document.querySelector("#email");
const password = document.querySelector("#pswrd");
const confrm = document.querySelector("#confirm");
const eyes = document.querySelectorAll(".eye");

formm.addEventListener("submit", (e) => {
  e.preventDefault();
  const users = getData("users");

  let user = {
    userId: Math.max(...users.map(usr => usr.userId)) + 1,
    name: cleanData(fullName.value, 1),
    studentId: sid.value.trim().toUpperCase(),
    email: email.value.trim().toLowerCase(),
    password: password.value,
  };

  if (!user.name || !user.studentId || !user.email) {
    alert("please fill the details correctly");
    return;
  }

  const regex = /^stu\d{3}$/i;
  if (!regex.test(user.studentId)) {
    alert("please write valid student Id\nStudentId should start with 'stu' followed by 3 digits.");
    return;
  }

  if (password.value !== confrm.value) {
    alert("password doesn't match");
    return;
  }

  if (
    users.some(
      (usr) => usr.studentId === user.studentId || usr.email === user.email,
    )
  ) {
    alert("user already exists");
    return;
  }

  users.push(user);
  saveData("users", users);
  alert("registration successful");
  formm.reset();
  window.location.href = "login.html";
});

eyes.forEach((eye) => {
  eye.addEventListener("click", () => {
    if (eye.classList.contains("fa-eye")) {
      eye.setAttribute("class", "far fa-eye-slash eye");
      eye.previousElementSibling.type = "text";
    } else {
      eye.setAttribute("class", "far fa-eye eye");
      eye.previousElementSibling.type = "password";
    }
  });
});


