package com.project.back_end.controller;

import com.project.back_end.entity.Appointment;
import com.project.back_end.service.AppointmentService;
import com.project.back_end.service.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final Service service;

    @Autowired
    public AppointmentController(AppointmentService appointmentService, Service service) {
        this.appointmentService = appointmentService;
        this.service = service;
    }

    @GetMapping("/{date}/{patientName}/{token}")
    public ResponseEntity<Map<String, Object>> getAppointments(@PathVariable String date,
                                                               @PathVariable String patientName,
                                                               @PathVariable String token) {
        ResponseEntity<Map<String, String>> validation = service.validateToken(token, "doctor");
        if (validation.getStatusCode().is2xxSuccessful()) {
            return appointmentService.getAppointment(date, patientName);
        } else {
            return ResponseEntity.status(validation.getStatusCode()).body(Map.of("error", "Unauthorized"));
        }
    }

    @PostMapping("/{token}")
    public ResponseEntity<Map<String, String>> bookAppointment(@PathVariable String token,
                                                               @RequestBody Appointment appointment) {
        ResponseEntity<Map<String, String>> validation = service.validateToken(token, "patient");
        if (!validation.getStatusCode().is2xxSuccessful()) {
            return validation;
        }

        int status = service.validateAppointment(appointment);
        if (status == 1) {
            return appointmentService.bookAppointment(appointment);
        } else if (status == 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "Appointment time is unavailable"));
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "Doctor does not exist"));
        }
    }

    @PutMapping("/{token}")
    public ResponseEntity<Map<String, String>> updateAppointment(@PathVariable String token,
                                                                 @RequestBody Appointment appointment) {
        ResponseEntity<Map<String, String>> validation = service.validateToken(token, "patient");
        if (validation.getStatusCode().is2xxSuccessful()) {
            return appointmentService.updateAppointment(appointment);
        } else {
            return validation;
        }
    }

    @DeleteMapping("/{id}/{token}")
    public ResponseEntity<Map<String, String>> cancelAppointment(@PathVariable Long id,
                                                                 @PathVariable String token) {
        ResponseEntity<Map<String, String>> validation = service.validateToken(token, "patient");
        if (validation.getStatusCode().is2xxSuccessful()) {
            return appointmentService.cancelAppointment(id);
        } else {
            return validation;
        }
    }
}
