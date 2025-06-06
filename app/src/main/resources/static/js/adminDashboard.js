// adminDashboard.js

import { openModal } from './components/modals.js';
import { getDoctors, filterDoctors, saveDoctor } from './services/doctorServices.js';
import { createDoctorCard } from './components/doctorCard.js';

window.onload = function () {
  // Load all doctors when page loads
  loadDoctorCards();

  // Add Doctor button opens the addDoctor modal
  document.getElementById('addDocBtn')?.addEventListener('click', () => {
    openModal('addDoctor');
  });

  // Search & Filter bindings
  document.getElementById("searchBar")?.addEventListener("input", filterDoctorsOnChange);
  document.getElementById("filterTime")?.addEventListener("change", filterDoctorsOnChange);
  document.getElementById("filterSpecialty")?.addEventListener("change", filterDoctorsOnChange);

  // Submit event for add doctor form
  document.getElementById("addDoctorForm")?.addEventListener("submit", adminAddDoctor);
};

// Load all doctors
async function loadDoctorCards() {
  const contentDiv = document.getElementById("content");
  contentDiv.innerHTML = "";

  try {
    const doctors = await getDoctors();

    if (doctors.length === 0) {
      contentDiv.innerHTML = "<p>No doctors found.</p>";
      return;
    }

    renderDoctorCards(doctors);
  } catch (error) {
    console.error("Error loading doctors:", error);
    contentDiv.innerHTML = "<p>Error loading doctors.</p>";
  }
}

// Filter/Search doctors
async function filterDoctorsOnChange() {
  const name = document.getElementById("searchBar")?.value || "";
  const time = document.getElementById("filterTime")?.value || "";
  const specialty = document.getElementById("filterSpecialty")?.value || "";

  const contentDiv = document.getElementById("content");
  contentDiv.innerHTML = "";

  try {
    const filteredDoctors = await filterDoctors(name, time, specialty);

    if (filteredDoctors.length === 0) {
      contentDiv.innerHTML = "<p>No doctors found.</p>";
    } else {
      renderDoctorCards(filteredDoctors);
    }
  } catch (error) {
    console.error("Filter error:", error);
    contentDiv.innerHTML = "<p>Failed to filter doctors.</p>";
  }
}

// Render list of doctor cards
function renderDoctorCards(doctors) {
  const contentDiv = document.getElementById("content");
  doctors.forEach(doctor => {
    const card = createDoctorCard(doctor);
    contentDiv.appendChild(card);
  });
}

// Handle Add Doctor form submission
async function adminAddDoctor(event) {
  event.preventDefault();

  const name = document.getElementById("docName").value.trim();
  const specialty = document.getElementById("docSpecialty").value.trim();
  const email = document.getElementById("docEmail").value.trim();
  const password = document.getElementById("docPassword").value.trim();
  const phone = document.getElementById("docPhone").value.trim();

  const checkboxes = document.querySelectorAll('input[name="availability"]:checked');
  const availability = Array.from(checkboxes).map(cb => cb.value);

  const token = localStorage.getItem("token");
  if (!token) {
    alert("You are not authorized. Please log in again.");
    return;
  }

  const doctor = {
    name,
    specialty,
    email,
    password,
    phone,
    availability
  };

  try {
    const result = await saveDoctor(doctor, token);
    if (result.success) {
      alert("Doctor added successfully!");
      document.getElementById("addDoctorForm").reset();
      document.getElementById("addDoctorModal").style.display = "none";
      loadDoctorCards();
    } else {
      alert("Failed to add doctor: " + result.message);
    }
  } catch (error) {
    console.error("Add Doctor error:", error);
    alert("An error occurred while adding the doctor.");
  }
}
