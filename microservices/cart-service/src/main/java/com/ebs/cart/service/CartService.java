package com.ebs.cart.service;

import com.ebs.cart.client.CatalogServiceClient;
import com.ebs.cart.model.Cart;
import com.ebs.cart.model.CartItem;
import com.ebs.cart.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CatalogServiceClient catalogServiceClient;
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
     * - Validates product existence via Feign call to catalog-service.
     * - If product already in items → update quantity atomically.
     * - If new → $push it into the embedded items array.
     */
    public Cart addItem(String userId, String productId, int quantity) {
        // Validate product exists via catalog-service (Feign)
        ResponseEntity<?> response = catalogServiceClient.getProductById(productId);
        if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
            throw new RuntimeException("Product not found: " + productId);
        }

        Cart cart = getOrCreateCart(userId);

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
     * Called by order-payment-service via Feign.
     */
    public void clearCart(String userId) {
        Query query = new Query(Criteria.where("user_id").is(userId));
        Update update = new Update().set("items", java.util.Collections.emptyList());
        mongoTemplate.updateFirst(query, update, Cart.class);
    }
}
