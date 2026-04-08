package com.ebs.service;

import com.ebs.model.Cart;
import com.ebs.model.Order;
import com.ebs.model.OrderItem;
import com.ebs.model.Product;
import com.ebs.model.enums.OrderStatus;
import com.ebs.repository.CartRepository;
import com.ebs.repository.OrderRepository;
import com.ebs.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final CartService cartService;
    private final MongoTemplate mongoTemplate;

    /**
     * Converts the user's active cart into a placed Order.
     *
     * CONCURRENCY CONTROL:
     * For each item we use an atomic $inc: { quantity: -qty } on the Product document.
     * This prevents overselling even under concurrent requests because MongoDB's
     * atomic update guarantees only one write wins per document at a time.
     * We first check quantity >= requested using a filtered query — if the update
     * matches 0 documents, the item is out of stock.
     */
    public Order placeOrder(String userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("No cart found for user: " + userId));

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty — cannot place order");
        }

        List<OrderItem> orderItems = new ArrayList<>();
        double totalAmount = 0.0;

        for (var cartItem : cart.getItems()) {
            Product product = productRepository.findById(cartItem.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + cartItem.getProductId()));

            int requestedQty = cartItem.getQuantity();

            // Atomic inventory decrement — only succeeds if quantity >= requestedQty
            // $inc: { quantity: -requestedQty } where quantity >= requestedQty
            Query stockQuery = new Query(
                    Criteria.where("_id").is(cartItem.getProductId())
                            .and("quantity").gte(requestedQty)
            );
            Update stockUpdate = new Update().inc("quantity", -requestedQty);
            var updateResult = mongoTemplate.updateFirst(stockQuery, stockUpdate, Product.class);

            if (updateResult.getMatchedCount() == 0) {
                throw new RuntimeException(
                        "Insufficient stock for product: " + product.getProductName() +
                        " (available: " + product.getQuantity() + ", requested: " + requestedQty + ")"
                );
            }

            // Use salePrice if available, else originalPrice (price snapshot)
            double itemPrice = (product.getSalePrice() != null && product.getSalePrice() > 0)
                    ? product.getSalePrice()
                    : product.getOriginalPrice();

            orderItems.add(OrderItem.builder()
                    .productId(cartItem.getProductId())
                    .quantity(requestedQty)
                    .price(itemPrice)
                    .build());

            totalAmount += itemPrice * requestedQty;
        }

        Order order = Order.builder()
                .userId(userId)
                .items(orderItems)
                .totalAmount(totalAmount)
                .status(OrderStatus.PENDING)
                .build();

        Order savedOrder = orderRepository.save(order);

        // Clear cart after successful order placement
        cartService.clearCart(userId);

        return savedOrder;
    }

    public List<Order> getOrdersByUser(String userId) {
        return orderRepository.findByUserId(userId);
    }

    public Optional<Order> getOrderById(String orderId) {
        return orderRepository.findById(orderId);
    }

    public Order updateOrderStatus(String orderId, OrderStatus status) {
        return orderRepository.findById(orderId).map(order -> {
            order.setStatus(status);
            return orderRepository.save(order);
        }).orElseThrow(() -> new RuntimeException("Order not found: " + orderId));
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
}
