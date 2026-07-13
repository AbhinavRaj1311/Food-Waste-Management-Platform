package spr.food.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import spr.food.model.FoodDonation;
import spr.food.service.FoodDonationService;

import java.util.List;


@CrossOrigin
@RestController
@RequestMapping("/donations")
public class FoodDonationController{

    @Autowired
    private FoodDonationService donationService;

    // Create a new donation
    @PostMapping
    public ResponseEntity<FoodDonation> createDonation(@RequestBody FoodDonation donation) {
        return ResponseEntity.ok(donationService.createDonation(donation));
    }
    @GetMapping("/donor/{donorId}")
    public List<FoodDonation> getDonationsByDonorId(@PathVariable Long donorId) {
        return donationService.getDonationsByDonorId(donorId);
    }
    

    // Get a donation by ID
    @GetMapping("/{id}")
    public ResponseEntity<FoodDonation> getDonationById(@PathVariable Long id) {
        return ResponseEntity.of(donationService.getDonationById(id));
    }

    // Get all donations
    @GetMapping
    public ResponseEntity<List<FoodDonation>> getAllDonations() {
        return ResponseEntity.ok(donationService.getAllDonations());
    }

    // Update a donation
    @PutMapping("/{id}")
    public ResponseEntity<FoodDonation> updateDonation(@PathVariable Long id, @RequestBody FoodDonation updatedDonation) {
        return ResponseEntity.ok(donationService.updateDonation(id, updatedDonation));
    }

    // Delete a donation
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDonation(@PathVariable Long id) {
        donationService.deleteDonation(id);
        return ResponseEntity.noContent().build();
    }
}
