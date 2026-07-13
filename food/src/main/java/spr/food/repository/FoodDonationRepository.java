package spr.food.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import spr.food.model.FoodDonation;


@Repository

public interface FoodDonationRepository extends JpaRepository<FoodDonation, Long>{
	
    List<FoodDonation> findByDonorId(Long donorId);

	
	

}
