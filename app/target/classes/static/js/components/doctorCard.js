import { getPatientData } from "../services/patientService.js";
import { showBookingOverlay } from "../components/bookingOverlay.js";
import { deleteDoctorById } from "../services/doctorService.js";

export function createDoctorCard(doctor) {
  const role = localStorage.getItem("userRole");

  // Main card container
  const card = document.createElement("div");
  card.classList.add("doctor-card");

  // Doctor info section
  const infoDiv = document.createElement("div");
  infoDiv.classList.add("doctor-info");

  const name = document.createElement("h3");
  name.textContent = doctor.name;

  const specialization = document.createElement("p");
  specialization.innerHTML = `<strong>Specialty:</strong> ${doctor.specialty}`;

  const email = document.createElement("p");
  email.innerHTML = `<strong>Email:</strong> ${doctor.email}`;

  const availability = document.createElement("p");
  availability.innerHTML = `<strong>Available At:</strong> ${doctor.availableTimes?.join(", ") || "Not Available"}`;

  // Append doctor info
  infoDiv.appendChild(name);
  infoDiv.appendChild(specialization);
  infoDiv.appendChild(email);
  infoDiv.appendChild(availability);

  // Button/action container
  const actionsDiv = document.createElement("div");
  actionsDiv.classList.add("card-actions");

  // Admin: Show delete button
  if (role === "admin") {
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Delete";
    removeBtn.classList.add("delete-btn");

    removeBtn.addEventListener("click", async () => {
      const confirmDelete = confirm(`Are you sure you want to delete Dr. ${doctor.name}?`);
      if (!confirmDelete) return;

      const token = localStorage.getItem("token");
      const success = await deleteDoctorById(doctor.doctor_id, token);

      if (success) {
        card.remove(); // Remove card from DOM
        alert("Doctor deleted successfully.");
      } else {
        alert("Failed to delete doctor.");
      }
    });

    actionsDiv.appendChild(removeBtn);
  }

  // Not logged-in patient: Alert to login
  else if (role === "patient") {
    const bookNow = document.createElement("button");
    bookNow.textContent = "Book Now";
    bookNow.classList.add("book-btn");

    bookNow.addEventListener("click", () => {
      alert("You must be logged in to book an appointment.");
    });

    actionsDiv.appendChild(bookNow);
  }

  // Logged-in patient: Show actual booking
  else if (role === "loggedPatient") {
    const bookNow = document.createElement("button");
    bookNow.textContent = "Book Now";
    bookNow.classList.add("book-btn");

    bookNow.addEventListener("click", async (e) => {
      const token = localStorage.getItem("token");
      const patientData = await getPatientData(token);
      showBookingOverlay(e, doctor, patientData);
    });

    actionsDiv.appendChild(bookNow);
  }

  // Assemble everything into the card
  card.appendChild(infoDiv);
  card.appendChild(actionsDiv);

  return card;
}
