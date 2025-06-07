package com.project.back_end.repository;

import com.project.back_end.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {
    
    // Custom query method to find admin by username
    Admin findByUsername(String username);
}
