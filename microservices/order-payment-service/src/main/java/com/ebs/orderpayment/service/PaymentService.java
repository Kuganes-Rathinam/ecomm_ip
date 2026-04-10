package com.ebs.orderpayment.service;

import com.ebs.orderpayment.model.Payment;
import com.ebs.orderpayment.model.enums.PaymentStatus;
import com.ebs.orderpayment.repository.OrderRepository;
import com.ebs.orderpayment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;

    public Payment createPayment(String orderId, Double amount, String paymentMethod) {
        // Validate order exists — both order + payment are in the same service
        // so this is a direct local repository call (no Feign needed)
        orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));

        Payment payment = Payment.builder()
                .orderId(orderId)
                .amount(amount)
                .paymentMethod(paymentMethod)
                .paymentStatus(PaymentStatus.PENDING)
                .build();

        return paymentRepository.save(payment);
    }

    public Optional<Payment> getPaymentById(String paymentId) {
        return paymentRepository.findById(paymentId);
    }

    public Optional<Payment> getPaymentByOrderId(String orderId) {
        return paymentRepository.findByOrderId(orderId);
    }

    public Payment updatePaymentStatus(String paymentId, PaymentStatus status) {
        return paymentRepository.findById(paymentId).map(payment -> {
            payment.setPaymentStatus(status);
            return paymentRepository.save(payment);
        }).orElseThrow(() -> new RuntimeException("Payment not found: " + paymentId));
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public List<Payment> getPaymentsByStatus(PaymentStatus status) {
        return paymentRepository.findByPaymentStatus(status);
    }
}
