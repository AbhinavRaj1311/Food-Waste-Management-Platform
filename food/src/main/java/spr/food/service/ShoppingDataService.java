package spr.food.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import spr.food.model.ShoppingData;
import spr.food.repository.ShoppingDataRepository;

import java.util.List;
import java.util.Optional;

@Service
public class ShoppingDataService {

    @Autowired
    private ShoppingDataRepository shoppingDataRepository;

    // Create or Save Shopping Data
    public ShoppingData createShoppingData(ShoppingData shoppingData) {
        return shoppingDataRepository.save(shoppingData);
    }

    // Get Shopping Data by ID
    public Optional<ShoppingData> getShoppingDataById(Long id) {
        return shoppingDataRepository.findById(id);
    }

    public List<ShoppingData> getAllShoppingData() {
        return shoppingDataRepository.findAll();
    }

    // Get Shopping Data by User ID
    public List<ShoppingData> getShoppingDataByUserId(Long userId) {
        return shoppingDataRepository.findByUserId(userId);
    }

    // Update Shopping Data by User ID and ID
    public ShoppingData updateShoppingDataByUserId(Long id, Long userId, ShoppingData updatedShoppingData) {
        return shoppingDataRepository.findByIdAndUserId(id, userId).map(shoppingData -> {
            shoppingData.setItemName(updatedShoppingData.getItemName());
            shoppingData.setItemQuantity(updatedShoppingData.getItemQuantity());
            shoppingData.setPurchaseDate(updatedShoppingData.getPurchaseDate());
            shoppingData.setExpiryDate(updatedShoppingData.getExpiryDate());
            shoppingData.setDaysRemaining(updatedShoppingData.getDaysRemaining());
            shoppingData.setStatus(updatedShoppingData.getStatus());
            shoppingData.setCategory(updatedShoppingData.getCategory());
            shoppingData.setCal(updatedShoppingData.getCal());
            return shoppingDataRepository.save(shoppingData);
        }).orElseThrow(() -> new RuntimeException("Shopping data not found for userId: " + userId + " and id: " + id));
    }

    // Delete Shopping Data by User ID and ID
    public void deleteShoppingDataByUserId(Long id, Long userId) {
        shoppingDataRepository.findByIdAndUserId(id, userId).ifPresentOrElse(
                shoppingDataRepository::delete,
                () -> {
                    throw new RuntimeException("Shopping data not found for userId: " + userId + " and id: " + id);
                }
        );
    }
}
