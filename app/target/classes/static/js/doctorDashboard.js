// doctorDashboard.js

// Import required modules
import { getAllAppointments } from './services/appointmentRecordService.js';
import { createPatientRow } from './components/patientRows.js';

// Global Variables
let selectedDate = new Date().toISOString().split('T')[0]; // default to today's date
let token = localStorage.getItem("token");
let patientName = null;

// DOM Elements
const searchBar = document.getElementById("searchBar");
const datePicker = document.getElementById("datePicker");
const todayButton = document.getElementById("todayButton");
const patientTableBody = document.getElementById("patientTableBody");

// Event Listener: Search Bar
searchBar?.addEventListener("input", () => {
  const value = searchBar.value.trim();
  patientName = value === "" ? "null" : value;
  loadAppointments();
});

// Event Listener: Date Picker
datePicker?.addEventListener("change", (e) => {
  selectedDate = e.target.value;
  loadAppointments();
});

// Event Listener: Today's Button
todayButton?.addEventListener("click", () => {
  selectedDate = new Date().toISOString().split("T")[0];
  datePicker.value = selectedDate;
  loadAppointments();
});

// Initial Load
window.addEventListener("DOMContentLoaded", () => {
  if (datePicker) datePicker.value = selectedDate;
  loadAppointments();
});

// Load Appointments Function
async function loadAppointments() {
  patientTableBody.innerHTML = ""; // Clear table before loading

  try {
    const appointments = await getAllAppointments(selectedDate, patientName || "null", token);

    if (!appointments || appointments.length === 0) {
      patientTableBody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center">No appointments found for the selected date.</td>
        </tr>`;
      return;
    }

    appointments.forEach((appointment) => {
      const row = createPatientRow(appointment);
      patientTableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Failed to load appointments:", error);
    patientTableBody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center text-danger">Error fetching appointments. Please try again later.</td>
      </tr>`;
  }
}
