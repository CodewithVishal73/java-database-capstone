
import { API_BASE_URL } from "../config/config.js";

const DOCTOR_API = `${API_BASE_URL}/doctor`;

// 1. Get all doctors
export async function getDoctors() {
  try {
    const response = await fetch(DOCTOR_API);
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return [];
  }
}

// 2. Delete a doctor by ID (Admin only)
export async function deleteDoctor(id, token) {
  try {
    const response = await fetch(`${DOCTOR_API}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await response.json();
    return {
      success: response.ok,
      message: result.message || "Doctor deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting doctor:", error);
    return { success: false, message: "Failed to delete doctor" };
  }
}

// 3. Save (Add) a new doctor (Admin only)
export async function saveDoctor(doctor, token) {
  try {
    const response = await fetch(DOCTOR_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(doctor),
    });
    const result = await response.json();
    return {
      success: response.ok,
      message: result.message || "Doctor added successfully",
    };
  } catch (error) {
    console.error("Error adding doctor:", error);
    return { success: false, message: "Failed to save doctor" };
  }
}

// 4. Filter doctors by name, time, or specialty
export async function filterDoctors(name = "", time = "", specialty = "") {
  try {
    const query = new URLSearchParams({
      name,
      time,
      specialty,
    }).toString();

    const response = await fetch(`${DOCTOR_API}/filter?${query}`);
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error("Error filtering doctors:", error);
    return [];
  }
}
