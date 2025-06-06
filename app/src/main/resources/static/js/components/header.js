export function renderHeader() {
  const headerDiv = document.getElementById("header");

  if (!headerDiv) return;

  // Don't show header on homepage
  if (window.location.pathname.endsWith("/")) {
    localStorage.removeItem("userRole");
    localStorage.removeItem("token");
    return;
  }

  const role = localStorage.getItem("userRole");
  const token = localStorage.getItem("token");

  // Handle invalid session
  if ((role === "loggedPatient" || role === "admin" || role === "doctor") && !token) {
    localStorage.removeItem("userRole");
    alert("Session expired or invalid login. Please log in again.");
    window.location.href = "/";
    return;
  }

  let headerContent = `
    <nav class="header-nav">
      <div class="logo"><a href="/">Cyber Clinic</a></div>
      <div class="nav-links">
  `;

  if (role === "admin") {
    headerContent += `
      <button id="addDocBtn" class="adminBtn">Add Doctor</button>
      <a href="#" id="logoutBtn">Logout</a>
    `;
  } else if (role === "doctor") {
    headerContent += `
      <a href="/doctor/doctorDashboard">Home</a>
      <a href="#" id="logoutBtn">Logout</a>
    `;
  } else if (role === "loggedPatient") {
    headerContent += `
      <a href="/patient/patientDashboard">Home</a>
      <a href="/patient/appointments">Appointments</a>
      <a href="#" id="logoutPatientBtn">Logout</a>
    `;
  } else if (role === "patient") {
    headerContent += `
      <a href="/login">Login</a>
      <a href="/signup">Sign Up</a>
    `;
  }

  headerContent += `
      </div>
    </nav>
  `;

  // Inject the header into the page
  headerDiv.innerHTML = headerContent;

  // Attach event listeners
  attachHeaderButtonListeners();
}

function attachHeaderButtonListeners() {
  const addDoctorBtn = document.getElementById("addDocBtn");
  if (addDoctorBtn) {
    addDoctorBtn.addEventListener("click", () => openModal("addDoctor"));
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }

  const logoutPatientBtn = document.getElementById("logoutPatientBtn");
  if (logoutPatientBtn) {
    logoutPatientBtn.addEventListener("click", logoutPatient);
  }
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userRole");
  window.location.href = "/";
}

function logoutPatient() {
  localStorage.removeItem("token");
  localStorage.setItem("userRole", "patient");
  window.location.href = "/patient";
}
