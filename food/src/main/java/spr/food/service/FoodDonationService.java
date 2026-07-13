package spr.food.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import spr.food.model.FoodDonation;
import spr.food.repository.FoodDonationRepository;

import java.util.List;
import java.util.Optional;

@Service
public class FoodDonationService {

    @Autowired
    private FoodDonationRepository donationRepository;

    // Create or Save Donation
    public FoodDonation createDonation(FoodDonation donation) {
        return donationRepository.save(donation);
    }

    // Get Donation by ID
    public Optional<FoodDonation> getDonationById(Long id) {
        return donationRepository.findById(id);
    }
    
    public List<FoodDonation> getDonationsByDonorId(Long donorId) {
        return donationRepository.findByDonorId(donorId);
    }
    

    // Get All Donations
    public List<FoodDonation> getAllDonations() {
        return donationRepository.findAll();
    }

    // Update Donation
    public FoodDonation updateDonation(Long id, FoodDonation updatedDonation) {
        return donationRepository.findById(id).map(donation -> {
            donation.setPostDate(updatedDonation.getPostDate());
            donation.setQuantity(updatedDonation.getQuantity());
            donation.setAddress(updatedDonation.getAddress());
            donation.setAlternateContact(updatedDonation.getAlternateContact());
            donation.setClaimDate(updatedDonation.getClaimDate());
            donation.setAvailabilityStatus(updatedDonation.isAvailabilityStatus());
            return donationRepository.save(donation);
        }).orElseThrow(() -> new RuntimeException("Donation not found with id: " + id));
    }

    // Delete Donation
    public void deleteDonation(Long id) {
        if (donationRepository.existsById(id)) {
            donationRepository.deleteById(id);
        } else {
            throw new RuntimeException("Donation not found with id: " + id);
        }
    }
}
