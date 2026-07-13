package spr.food.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import spr.food.model.Admin;


@Repository
public interface AdminRepository extends JpaRepository<Admin, String> {
	
	Admin findByUsername(String username);

	
 

}
