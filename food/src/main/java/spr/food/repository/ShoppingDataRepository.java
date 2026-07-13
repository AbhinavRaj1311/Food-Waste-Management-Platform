package spr.food.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import spr.food.model.ShoppingData;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShoppingDataRepository extends JpaRepository<ShoppingData, Long> {
    List<ShoppingData> findByUserId(Long userId);
    Optional<ShoppingData> findByIdAndUserId(Long id, Long userId);
}