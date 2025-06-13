package com.project.back_end.controllers;
import com.project.back_end.services.TokenValidationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.Map;

@Controller
public class DashboardController {

    @Autowired
    private TokenValidationService tokenValidationService;

    @GetMapping("/adminDashboard/{token}")
    public String adminDashboard(@PathVariable String token) {
        Map<String, Object> validationResult = tokenValidationService.validateToken(token, "admin");

        if (validationResult.isEmpty()) {
            // Token is valid, return admin dashboard view
            return "admin/adminDashboard";
        } else {
            // Invalid token, redirect to login page
            return "redirect:/";
        }
    }

    @GetMapping("/doctorDashboard/{token}")
    public String doctorDashboard(@PathVariable String token) {
        Map<String, Object> validationResult = tokenValidationService.validateToken(token, "doctor");

        if (validationResult.isEmpty()) {
            // Token is valid, return doctor dashboard view
            return "doctor/doctorDashboard";
        } else {
            // Invalid token, redirect to login page
            return "redirect:/";
        }
    }
}
