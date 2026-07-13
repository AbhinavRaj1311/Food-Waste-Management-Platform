package spr.food.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import spr.food.model.Admin;
import spr.food.model.User;
import spr.food.service.AdminService;
import spr.food.service.UserService;

import jakarta.servlet.http.HttpSession;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private AdminService adminService;

    // User Login
    @PostMapping("/user/login")
    public ResponseEntity<String> loginUser(@RequestBody User loginRequest, HttpSession session) {
        String email = loginRequest.getEmail();
        String password = loginRequest.getPassword();

        User user = userService.getUserByEmail(email);
        if (user != null && user.getPassword().equals(password)) {
            // Store user information in the session
            session.setAttribute("userId", user.getId());
            session.setAttribute("userEmail", user.getEmail());
            session.setAttribute("role", "USER");

            return ResponseEntity.ok("User login successful for: " + user.getEmail());
        }
        return ResponseEntity.status(401).body("Invalid email or password.");
    }

    // Admin Login
    @PostMapping("/admin/login")
    public ResponseEntity<String> loginAdmin(@RequestBody Admin loginRequest, HttpSession session) {
        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();

//        Optional<Admin> optionalAdmin = adminService.getAdminByUsername(username);
        Admin admin = adminService.getAdminByUsername(username);
//        if (optionalAdmin.isPresent()) {
////            Admin admin = optionalAdmin.get();
//            if (admin.getPassword().equals(password)) {
        if (admin != null && admin.getPassword().equals(password)) {

                // Store admin information in the session
//                 session.setAttribute("adminId", admin.getId());
                session.setAttribute("adminUsername", admin.getUsername());
                session.setAttribute("role", "ADMIN");

                return ResponseEntity.ok("Admin login successful for: " + username);
            }
        return ResponseEntity.status(401).body("Invalid username or password.");
    }

    // User Registration
    @PostMapping("/user/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        return ResponseEntity.ok(userService.createUser(user));
    }

    // Admin Registration
    @PostMapping("/admin/register")
    public ResponseEntity<Admin> registerAdmin(@RequestBody Admin admin) {
        return ResponseEntity.ok(adminService.createAdmin(admin));
    }

    // Logout Endpoint
    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpSession session) {
        // Invalidate the session to log out the user or admin
        session.invalidate();
        return ResponseEntity.ok("Logged out successfully.");
    }

    // Check Login Status
    @GetMapping("/status")
    public ResponseEntity<String> checkStatus(HttpSession session) {
        String role = (String) session.getAttribute("role");
        if (role != null) {
            return ResponseEntity.ok("Logged in as: " + role);
        }
        return ResponseEntity.status(401).body("Not logged in.");
    }
    @GetMapping("/user/details")
public ResponseEntity<User> getUserDetails(HttpSession session) {
    String email = (String) session.getAttribute("userEmail");
    if (email != null) {
        User user = userService.getUserByEmail(email);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
    }
    return ResponseEntity.status(401).build(); // Unauthorized if session is invalid
}
    @GetMapping("/admin/details")
    public ResponseEntity<Admin> getAdminDetails(HttpSession session) {
        String username = (String) session.getAttribute("adminUsername");
        // String role = (String) session.getAttribute("role");

        if (username != null) {
            Admin admin = adminService.getAdminByUsername(username);
            if (admin != null) {

                return ResponseEntity.ok(admin);
            }
        }
        return ResponseEntity.status(401).build(); // Unauthorized if session is invalid
    }


}