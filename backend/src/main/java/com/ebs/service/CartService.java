package com.ebs.service;

import com.ebs.model.Cart;
import com.ebs.model.CartItem;
import com.ebs.repository.CartRepository;
import com.ebs.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final MongoTemplate mongoTemplate;

    /**
     * Returns the user's cart, creating one if it doesn't exist.
     */
    public Cart getOrCreateCart(String userId) {
        return cartRepository.findByUserId(userId)
                .orElseGet(() -> cartRepository.save(
                        Cart.builder().userId(userId).build()
                ));
    }

    /**
     * Add an item to the cart.
     * - If product already exists in items array → update quantity atomically.
     * - If new item → $push it into the embedded items array.
     */
    public Cart addItem(String userId, String productId, int quantity) {
        // Validate product exists
        productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found: " + productId));

        Cart cart = getOrCreateCart(userId);

        // Check if product already in cart
        boolean exists = cart.getItems().stream()
                .anyMatch(item -> item.getProductId().equals(productId));

        if (exists) {
            // Atomically increment quantity of existing item using $inc on sub-document
            Query query = new Query(
                    Criteria.where("user_id").is(userId)
                            .and("items.productId").is(productId)
            );
            Update update = new Update().inc("items.$.quantity", quantity);
            mongoTemplate.updateFirst(query, update, Cart.class);
        } else {
            // Atomically push new CartItem into the embedded array using $push
            Query query = new Query(Criteria.where("user_id").is(userId));
            CartItem newItem = new CartItem(productId, quantity);
            Update update = new Update().push("items", newItem);
            mongoTemplate.updateFirst(query, update, Cart.class);
        }

        return cartRepository.findByUserId(userId).orElseThrow();
    }

    /**
     * Remove a specific product from the cart's embedded items array using $pull.
     */
    public Cart removeItem(String userId, String productId) {
        Query query = new Query(Criteria.where("user_id").is(userId));
        // $pull removes all elements matching the condition from the embedded array
        Update update = new Update().pull("items",
                new org.bson.Document("productId", productId));
        mongoTemplate.updateFirst(query, update, Cart.class);

        return cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found for user: " + userId));
    }

    /**
     * Update quantity of an existing item in the cart.
     */
    public Cart updateItemQuantity(String userId, String productId, int newQuantity) {
        if (newQuantity <= 0) {
            return removeItem(userId, productId);
        }
        Query query = new Query(
                Criteria.where("user_id").is(userId)
                        .and("items.productId").is(productId)
        );
        Update update = new Update().set("items.$.quantity", newQuantity);
        mongoTemplate.updateFirst(query, update, Cart.class);

        return cartRepository.findByUserId(userId).orElseThrow();
    }

    /**
     * Clear the entire embedded items array after order placement.
     */
    public void clearCart(String userId) {
        Query query = new Query(Criteria.where("user_id").is(userId));
        Update update = new Update().set("items", java.util.Collections.emptyList());
        mongoTemplate.updateFirst(query, update, Cart.class);
    }
}
