package com.project.back_end.service;

import com.project.back_end.dto.AppointmentDTO;
import com.project.back_end.entity.Appointment;
import com.project.back_end.entity.Doctor;
import com.project.back_end.entity.Patient;
import com.project.back_end.repository.AppointmentRepository;
import com.project.back_end.repository.DoctorRepository;
import com.project.back_end.repository.PatientRepository;
import com.project.back_end.security.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private TokenService tokenService;

    public int createPatient(Patient patient) {
        try {
            patientRepository.save(patient);
            return 1;
        } catch (Exception e) {
            return 0;
        }
    }

    public ResponseEntity<Map<String, Object>> getPatientAppointment(Long id, String token) {
        String email = tokenService.extractEmail(token);
        Patient patient = patientRepository.findByEmail(email);

        if (patient == null || !patient.getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized access"));
        }

        List<Appointment> appointments = appointmentRepository.findByPatientId(id);
        List<AppointmentDTO> result = appointments.stream()
                .map(AppointmentDTO::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(Map.of("appointments", result));
    }

    public ResponseEntity<Map<String, Object>> filterByCondition(String condition, Long id) {
        List<Appointment> appointments = appointmentRepository.findByPatientId(id);
        List<AppointmentDTO> filtered;

        if ("past".equalsIgnoreCase(condition)) {
            filtered = appointments.stream()
                    .filter(a -> a.getAppointmentTime().isBefore(LocalDateTime.now()))
                    .map(AppointmentDTO::new)
                    .collect(Collectors.toList());
        } else if ("future".equalsIgnoreCase(condition)) {
            filtered = appointments.stream()
                    .filter(a -> a.getAppointmentTime().isAfter(LocalDateTime.now()))
                    .map(AppointmentDTO::new)
                    .collect(Collectors.toList());
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid condition"));
        }

        return ResponseEntity.ok(Map.of("appointments", filtered));
    }

    public ResponseEntity<Map<String, Object>> filterByDoctor(String name, Long patientId) {
        List<Appointment> appointments = appointmentRepository.findByPatientId(patientId);
        List<AppointmentDTO> filtered = appointments.stream()
                .filter(a -> {
                    Doctor doctor = doctorRepository.findById(a.getDoctorId()).orElse(null);
                    return doctor != null && doctor.getName().toLowerCase().contains(name.toLowerCase());
                })
                .map(AppointmentDTO::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(Map.of("appointments", filtered));
    }

    public ResponseEntity<Map<String, Object>> filterByDoctorAndCondition(String condition, String name, long patientId) {
        List<Appointment> appointments = appointmentRepository.findByPatientId(patientId);
        List<AppointmentDTO> filtered = appointments.stream()
                .filter(a -> {
                    Doctor doctor = doctorRepository.findById(a.getDoctorId()).orElse(null);
                    boolean nameMatch = doctor != null && doctor.getName().toLowerCase().contains(name.toLowerCase());
                    boolean conditionMatch = "past".equalsIgnoreCase(condition)
                            ? a.getAppointmentTime().isBefore(LocalDateTime.now())
                            : "future".equalsIgnoreCase(condition)
                                && a.getAppointmentTime().isAfter(LocalDateTime.now());
                    return nameMatch && conditionMatch;
                })
                .map(AppointmentDTO::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(Map.of("appointments", filtered));
    }

    public ResponseEntity<Map<String, Object>> getPatientDetails(String token) {
        String email = tokenService.extractEmail(token);
        Patient patient = patientRepository.findByEmail(email);

        if (patient == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Patient not found"));
        }

        return ResponseEntity.ok(Map.of("patient", patient));
    }
}
