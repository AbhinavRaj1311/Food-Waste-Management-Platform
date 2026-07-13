package spr.food.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import spr.food.model.User;


@Repository
public interface UserRepository  extends JpaRepository<User, Long>{
	
	User findByEmail(String email);

}
