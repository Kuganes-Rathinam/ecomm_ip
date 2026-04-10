package com.ebs.orderpayment.service;

import com.ebs.orderpayment.client.CartDto;
import com.ebs.orderpayment.client.CartItemDto;
import com.ebs.orderpayment.client.CartServiceClient;
import com.ebs.orderpayment.model.Order;
import com.ebs.orderpayment.model.OrderItem;
import com.ebs.orderpayment.model.Product;
import com.ebs.orderpayment.model.enums.OrderStatus;
import com.ebs.orderpayment.repository.OrderRepository;
import com.ebs.orderpayment.repository.ProductRepository;
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
    private final ProductRepository productRepository;
    private final CartServiceClient cartServiceClient;
    private final MongoTemplate mongoTemplate;

    /**
     * Converts the user's active cart into a placed Order.
     *
     * CROSS-SERVICE FLOW:
     * 1. Fetch the user's cart via Feign call to cart-service.
     * 2. For each item, perform an atomic $inc stock decrement against the shared MongoDB.
     *    (The products collection is shared — same MongoDB instance — so MongoTemplate
     *    atomicity is preserved without distributed transactions.)
     * 3. Save the Order document.
     * 4. Clear the cart via Feign call to cart-service.
     *
     * CONCURRENCY CONTROL:
     * The atomic $inc: { quantity: -qty } on the Product document prevents overselling
     * under concurrent requests. MongoDB's atomic update guarantees only one write wins
     * per document. We first check quantity >= requested via a filtered query.
     */
    public Order placeOrder(String userId) {
        // Step 1: Fetch cart from cart-service via Feign
        CartDto cart = cartServiceClient.getCart(userId);

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty — cannot place order");
        }

        List<OrderItem> orderItems = new ArrayList<>();
        double totalAmount = 0.0;

        for (CartItemDto cartItem : cart.getItems()) {
            // Step 2a: Load product directly from shared MongoDB for price info
            Product product = productRepository.findById(cartItem.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + cartItem.getProductId()));

            int requestedQty = cartItem.getQuantity();

            // Step 2b: Atomic inventory decrement — only succeeds if quantity >= requestedQty
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

        // Step 3: Save order
        Order order = Order.builder()
                .userId(userId)
                .items(orderItems)
                .totalAmount(totalAmount)
                .status(OrderStatus.PENDING)
                .build();

        Order savedOrder = orderRepository.save(order);

        // Step 4: Clear cart after successful order placement (Feign call to cart-service)
        cartServiceClient.clearCart(userId);

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
