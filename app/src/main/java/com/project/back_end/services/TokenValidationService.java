package com.project.back_end.services;

import com.project.back_end.models.Admin;
import com.project.back_end.models.Doctor;
import com.project.back_end.models.Patient;
import com.project.back_end.repo.AdminRepository;
import com.project.back_end.repo.DoctorRepository;
import com.project.back_end.repo.PatientRepository;
import com.project.back_end.services.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class TokenValidationService {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    /**
     * Validates the token and checks whether the user exists in the corresponding repository.
     *
     * @param token the JWT token
     * @param role  the user role (admin, doctor, patient)
     * @return an empty map if valid, otherwise map with error info
     */
    public Map<String, Object> validateToken(String token, String role) {
        Map<String, Object> response = new HashMap<>();

        String email = tokenService.getEmail(token);
        if (email == null) {
            response.put("error", "Invalid token");
            return response;
        }

        switch (role.toLowerCase()) {
            case "admin":
                Admin admin = adminRepository.findByUsername(email);
                if (admin == null) {
                    response.put("error", "Admin not found");
                }
                break;

            case "doctor":
                Doctor doctor = doctorRepository.findByEmail(email);
                if (doctor == null) {
                    response.put("error", "Doctor not found");
                }
                break;

            case "patient":
                Patient patient = patientRepository.findByEmail(email);
                if (patient == null) {
                    response.put("error", "Patient not found");
                }
                break;

            default:
                response.put("error", "Invalid user role");
        }

        return response;
    }
}
