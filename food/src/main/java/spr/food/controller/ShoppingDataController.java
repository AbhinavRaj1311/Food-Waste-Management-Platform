package spr.food.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import spr.food.model.ShoppingData;
import spr.food.service.ShoppingDataService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/shopping-data")
public class ShoppingDataController {

    @Autowired
    private ShoppingDataService shoppingDataService;

    // Create a new shopping data entry
    @PostMapping
    public ResponseEntity<ShoppingData> createShoppingData(@RequestBody ShoppingData shoppingData) {
        return ResponseEntity.ok(shoppingDataService.createShoppingData(shoppingData));
    }

    // Get all shopping data entries
    @GetMapping
    public ResponseEntity<List<ShoppingData>> getAllShoppingData() {
        List<ShoppingData> shoppingDataList = shoppingDataService.getAllShoppingData();
        return ResponseEntity.ok(shoppingDataList);
    }

    // Get all shopping data entries for a specific userId
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ShoppingData>> getShoppingDataByUserId(@PathVariable Long userId) {
        List<ShoppingData> shoppingDataList = shoppingDataService.getShoppingDataByUserId(userId);
        return ResponseEntity.ok(shoppingDataList);
    }

    // Get a shopping data entry by ID
    @GetMapping("/{id}")
    public ResponseEntity<ShoppingData> getShoppingDataById(@PathVariable Long id) {
        Optional<ShoppingData> shoppingData = shoppingDataService.getShoppingDataById(id);
        return shoppingData.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Update a shopping data entry by userId and shoppingDataId
    @PutMapping("/{id}/user/{userId}")
    public ResponseEntity<ShoppingData> updateShoppingDataByUserId(
            @PathVariable Long id,
            @PathVariable Long userId,
            @RequestBody ShoppingData updatedShoppingData) {
        ShoppingData updatedData = shoppingDataService.updateShoppingDataByUserId(id, userId, updatedShoppingData);
        return ResponseEntity.ok(updatedData);
    }

    // Delete a shopping data entry by userId and shoppingDataId
    @DeleteMapping("/{id}/user/{userId}")
    public ResponseEntity<Void> deleteShoppingDataByUserId(@PathVariable Long id, @PathVariable Long userId) {
        shoppingDataService.deleteShoppingDataByUserId(id, userId);
        return ResponseEntity.noContent().build();
    }
}