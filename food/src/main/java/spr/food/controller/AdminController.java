package spr.food.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import spr.food.model.Admin;
import spr.food.service.AdminService;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/admins")
public class AdminController {

    @Autowired
    private AdminService adminService;

    // Create a new admin
    @PostMapping
    public ResponseEntity<Admin> createAdmin(@RequestBody Admin admin) {
        return ResponseEntity.ok(adminService.createAdmin(admin));
    }

    // Get an admin by username  
    //
    //
    // edit from of to ok
    @GetMapping("/{username}")
    public ResponseEntity<Admin> getAdminByUsername(@PathVariable String username) {
        return ResponseEntity.ok(adminService.getAdminByUsername(username));
    }

    // Get all admins
    @GetMapping
    public ResponseEntity<List<Admin>> getAllAdmins() {
        return ResponseEntity.ok(adminService.getAllAdmins());
    }

    // Update an admin
    @PutMapping("/{username}")
    public ResponseEntity<Admin> updateAdmin(@PathVariable String username, @RequestBody Admin updatedAdmin) {
        return ResponseEntity.ok(adminService.updateAdmin(username, updatedAdmin));
    }

    // Delete an admin
    @DeleteMapping("/{username}")
    public ResponseEntity<Void> deleteAdmin(@PathVariable String username) {
        adminService.deleteAdmin(username);
        return ResponseEntity.noContent().build();
    }
}
