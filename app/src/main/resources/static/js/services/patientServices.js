
import { API_BASE_URL } from "../config/config.js";

const PATIENT_API = `${API_BASE_URL}/patient`;

// 1. Patient Signup
export async function patientSignup(data) {
  try {
    const response = await fetch(`${PATIENT_API}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return {
      success: response.ok,
      message: result.message || "Signup successful",
    };
  } catch (error) {
    console.error("Signup error:", error);
    return { success: false, message: "Signup failed" };
  }
}

// 2. Patient Login
export async function patientLogin(data) {
  try {
    const response = await fetch(`${PATIENT_API}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    console.error("Login error:", error);
    throw new Error("Login failed");
  }
}

// 3. Get Logged-in Patient Data
export async function getPatientData(token) {
  try {
    const response = await fetch(`${PATIENT_API}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch patient data:", error);
    return null;
  }
}

// 4. Get Patient Appointments (Shared with Doctor Dashboard too)
export async function getPatientAppointments(id, token, user) {
  try {
    const response = await fetch(`${API_BASE_URL}/${user}/${id}/appointments`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return null;
  }
}

// 5. Filter Appointments (for Admin/Doctor)
export async function filterAppointments(condition, name, token) {
  try {
    const query = new URLSearchParams({
      condition,
      name,
    }).toString();

    const response = await fetch(`${API_BASE_URL}/appointment/filter?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data || [];
    }
    return [];
  } catch (error) {
    console.error("Error filtering appointments:", error);
    return [];
  }
}
