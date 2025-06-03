# Schema Design for Smart Clinic Management System

## MySQL Database Design

Structured data like patients, doctors, appointments, and clinic operations are best handled in a relational SQL database due to the need for strong consistency and relationships.

### Table: patients
- `id`: INT, PRIMARY KEY, AUTO_INCREMENT
- `first_name`: VARCHAR(100), NOT NULL
- `last_name`: VARCHAR(100), NOT NULL
- `dob`: DATE, NOT NULL
- `email`: VARCHAR(255), UNIQUE, NOT NULL
- `phone`: VARCHAR(15), UNIQUE, NOT NULL
- `address`: TEXT
- `created_at`: DATETIME, DEFAULT CURRENT_TIMESTAMP

> Each patient has unique contact info. Email and phone should be validated in application logic.

---

### Table: doctors
- `id`: INT, PRIMARY KEY, AUTO_INCREMENT
- `first_name`: VARCHAR(100), NOT NULL
- `last_name`: VARCHAR(100), NOT NULL
- `specialization`: VARCHAR(150)
- `email`: VARCHAR(255), UNIQUE, NOT NULL
- `phone`: VARCHAR(15), UNIQUE, NOT NULL
- `available_from`: TIME
- `available_to`: TIME
- `created_at`: DATETIME, DEFAULT CURRENT_TIMESTAMP

> We store availability in time fields for scheduling validation. Doctors must not be double-booked.

---

### Table: appointments
- `id`: INT, PRIMARY KEY, AUTO_INCREMENT
- `doctor_id`: INT, FOREIGN KEY REFERENCES doctors(id) ON DELETE CASCADE
- `patient_id`: INT, FOREIGN KEY REFERENCES patients(id) ON DELETE CASCADE
- `appointment_time`: DATETIME, NOT NULL
- `status`: INT DEFAULT 0
  - 0 = Scheduled
  - 1 = Completed
  - 2 = Cancelled
- `created_at`: DATETIME, DEFAULT CURRENT_TIMESTAMP

> If a patient or doctor is deleted, their appointments are removed as well.

---

### Table: admins
- `id`: INT, PRIMARY KEY, AUTO_INCREMENT
- `username`: VARCHAR(100), UNIQUE, NOT NULL
- `password_hash`: VARCHAR(255), NOT NULL
- `role`: ENUM('admin', 'staff'), DEFAULT 'staff'
- `email`: VARCHAR(255), UNIQUE
- `created_at`: DATETIME, DEFAULT CURRENT_TIMESTAMP

> Admins manage the system. Roles can be extended.

---

### Table: payments (optional extension)
- `id`: INT, PRIMARY KEY, AUTO_INCREMENT
- `appointment_id`: INT, FOREIGN KEY REFERENCES appointments(id)
- `amount`: DECIMAL(10,2), NOT NULL
- `payment_method`: ENUM('cash', 'credit_card', 'insurance')
- `payment_date`: DATETIME, DEFAULT CURRENT_TIMESTAMP
- `status`: ENUM('paid', 'pending', 'refunded') DEFAULT 'pending'

> Stores transaction history for audit and reporting.

---

## MongoDB Collection Design

MongoDB is great for unstructured or semi-structured data such as feedback, logs, chat messages, and prescriptions with variable metadata.

### Collection: prescriptions
```json
{
  "_id": "ObjectId('665ad1ee91a1d52a9b0b6f02')",
  "appointmentId": 17,
  "patientId": 5,
  "doctorId": 2,
  "medications": [
    {
      "name": "Ibuprofen",
      "dosage": "200mg",
      "frequency": "Twice a day",
      "duration": "5 days"
    },
    {
      "name": "Omeprazole",
      "dosage": "20mg",
      "frequency": "Once a day",
      "duration": "7 days"
    }
  ],
  "doctorNotes": "Avoid spicy food. Re-evaluation after 5 days.",
  "refillCount": 1,
  "createdAt": "2025-06-03T09:00:00Z"
}
