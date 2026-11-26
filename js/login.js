// DOM Elements
const passwordInput = document.getElementById("password");
const toggleBtn = document.getElementById("togglePassword");
const eyeOpen = document.getElementById("eyeOpen");
const eyeClosed = document.getElementById("eyeClosed");

const forgotPassword = document.getElementById("forgot-password");
const loginForm = document.getElementById("login-form");

const emailInput = document.getElementById("email");
const studentIdInput = document.getElementById("student-id");

const studentIdField = document.getElementById("student-id-field");
const passwordField = document.getElementById("password-field");

const errorMsg = document.getElementById("login-error");
const submitBtn = loginForm.querySelector('button[type="submit"]');

// Track whether user is in password recovery mode
let recoveryMode = false;


// ========================================
// PASSWORD VISIBILITY TOGGLE
// ========================================

toggleBtn.addEventListener("click", () => {
  const isHidden = passwordInput.type === "password";

  passwordInput.type = isHidden ? "text" : "password";

  eyeOpen.style.display = isHidden ? "none" : "block";
  eyeClosed.style.display = isHidden ? "block" : "none";

  toggleBtn.setAttribute(
    "aria-label",
    isHidden ? "Hide password" : "Show password",
  );
});


// ========================================
// FORGOT PASSWORD MODE
// ========================================

function toggleRecoveryMode() {
  recoveryMode = !recoveryMode;

  errorMsg.textContent = "";
  errorMsg.classList.remove("success");

  if (recoveryMode) {
    // Show Student ID field
    studentIdField.hidden = false;

    // Hide password field
    passwordField.hidden = true;

    // Update required attributes
    studentIdInput.required = true;
    passwordInput.required = false;

    // Change button and link text
    submitBtn.textContent = "Get Password";
    forgotPassword.textContent = "Back to Login";

    // Clear previous values
    studentIdInput.value = "";
    passwordInput.value = "";

    // Focus Student ID input
    studentIdInput.focus();

  } else {
    // Hide Student ID field
    studentIdField.hidden = true;

    // Show password field
    passwordField.hidden = false;

    // Restore required attributes
    studentIdInput.required = false;
    passwordInput.required = true;

    // Restore button and link text
    submitBtn.textContent = "Log In";
    forgotPassword.textContent = "forgot password?";

    // Clear previous values
    studentIdInput.value = "";
    passwordInput.value = "";

    // Reset password visibility
    passwordInput.type = "password";
    eyeOpen.style.display = "block";
    eyeClosed.style.display = "none";

    toggleBtn.setAttribute("aria-label", "Show password");
  }
}


// Forgot password click
forgotPassword.addEventListener("click", toggleRecoveryMode);

// Keyboard accessibility
forgotPassword.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    toggleRecoveryMode();
  }
});


// ========================================
// PASSWORD RECOVERY
// ========================================

function recoverPassword() {
  const email = emailInput.value.trim().toLowerCase();
  const studentId = studentIdInput.value.trim().toUpperCase();

  // Get students from localStorage
  const users = getData("users");

  // Find student using email
  const user = users.find(
    (u) => u.email.toLowerCase() === email
  );

  // Check whether student account exists
  if (!user) {
    errorMsg.textContent =
      "No student account found with this email address.";

    return;
  }

  // Check whether Student ID matches the same student
  if (user.studentId.toUpperCase() !== studentId) {
    errorMsg.textContent =
      "Incorrect Student ID.";

    return;
  }

  // ========================================
  // PASSWORD RECOVERED SUCCESSFULLY
  // ========================================

  const recoveredPassword = user.password;

  // Return to normal login mode
  toggleRecoveryMode();

  // Fill and display recovered password
  passwordInput.value = recoveredPassword;
  passwordInput.type = "text";

  eyeOpen.style.display = "none";
  eyeClosed.style.display = "block";

  toggleBtn.setAttribute("aria-label", "Hide password");

  // Display success message
  errorMsg.textContent =
    `Password recovered successfully! Your password is: ${recoveredPassword}`;

  errorMsg.classList.add("success");
}


// ========================================
// LOGIN FORM SUBMISSION
// ========================================

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  errorMsg.textContent = "";
  errorMsg.classList.remove("success");

  // If user is recovering password
  if (recoveryMode) {
    recoverPassword();
    return;
  }

  // Get email and password
  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value;

  // Get users and admins from localStorage
  const users = getData("users");
  const admins = getData("admins");

  // Find account using email
  const user = users.find(
    (u) => u.email.toLowerCase() === email
  );

  const admin = admins.find(
    (a) => a.email.toLowerCase() === email
  );

  // Check if account exists
  if (!user && !admin) {
    errorMsg.textContent =
      "Account not found. Please check your email.";

    return;
  }

  // Check student credentials
  if (user) {
    if (user.password !== password) {
      errorMsg.textContent =
        "Incorrect password. Please try again.";

      return;
    }

    saveData("currentUserId", user.userId);
    localStorage.removeItem("admin");

    window.location.href = "member-dashboard.html";
  }

  // Check admin credentials
  else {
    if (admin.password !== password) {
      errorMsg.textContent =
        "Incorrect password. Please try again.";

      return;
    }

    saveData("currentUserId", admin.userId);
    localStorage.setItem("admin", true);

    window.location.href = "admin-dashboard.html";
  }
});
