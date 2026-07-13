package spr.food.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import spr.food.model.Admin;
import spr.food.repository.AdminRepository;

import java.util.List;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    // Create or Save Admin
    public Admin createAdmin(Admin admin) {
        return adminRepository.save(admin);
    }

    // Get Admin by Username
//    public Optional<Admin> getAdminByUsername(String username) {
//        return adminRepository.findById(username);
//    }

    // Get All Admins
    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    // Update Admin
    public Admin updateAdmin(String username, Admin updatedAdmin) {
        return adminRepository.findById(username).map(admin -> {
            admin.setPassword(updatedAdmin.getPassword());
            return adminRepository.save(admin);
        }).orElseThrow(() -> new RuntimeException("Admin not found with username: " + username));
    }

    // Delete Admin
    public void deleteAdmin(String username) {
        if (adminRepository.existsById(username)) {
            adminRepository.deleteById(username);
        } else {
            throw new RuntimeException("Admin not found with username: " + username);
        }
    }
    public Admin getAdminByUsername(String email) {
        return adminRepository.findByUsername(email);
    }

}