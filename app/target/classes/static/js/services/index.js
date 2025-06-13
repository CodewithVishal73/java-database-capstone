
import { openModal } from '../components/modals.js';
import { API_BASE_URL } from '../config/config.js';

// API Endpoints
const ADMIN_API = API_BASE_URL + '/admin';
const DOCTOR_API = API_BASE_URL + '/doctor/login';

// Helper to store role
function selectRole(role) {
  localStorage.setItem('role', role);
}

// Admin Login Handler (Global)
window.adminLoginHandler = async function () {
  try {
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;

    const admin = { username, password };

    const response = await fetch(ADMIN_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(admin),
    });

    if (response.ok) {
      const result = await response.json();
      localStorage.setItem('token', result.token);
      selectRole('admin');
      alert('Admin login successful!');
      // Redirect or proceed
    } else {
      alert('Invalid credentials!');
    }
  } catch (error) {
    alert('An error occurred: ' + error.message);
  }
};

// Doctor Login Handler (Global)
window.doctorLoginHandler = async function () {
  try {
    const email = document.getElementById('doctorEmail').value;
    const password = document.getElementById('doctorPassword').value;

    const doctor = { email, password };

    const response = await fetch(DOCTOR_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doctor),
    });

    if (response.ok) {
      const result = await response.json();
      localStorage.setItem('token', result.token);
      selectRole('doctor');
      alert('Doctor login successful!');
      // Redirect or proceed
    } else {
      alert('Invalid credentials!');
    }
  } catch (error) {
    alert('An error occurred: ' + error.message);
  }
};

// Setup Button Event Listeners
window.onload = function () {
  const adminBtn = document.getElementById('adminLogin');
  const doctorBtn = document.getElementById('doctorLogin');

  if (adminBtn) {
    adminBtn.addEventListener('click', () => openModal('adminLogin'));
  }

  if (doctorBtn) {
    doctorBtn.addEventListener('click', () => openModal('doctorLogin'));
  }
};
