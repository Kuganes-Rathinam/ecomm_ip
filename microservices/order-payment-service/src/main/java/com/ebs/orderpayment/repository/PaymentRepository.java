package com.ebs.orderpayment.repository;

import com.ebs.orderpayment.model.Payment;
import com.ebs.orderpayment.model.enums.PaymentStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends MongoRepository<Payment, String> {
    Optional<Payment> findByOrderId(String orderId);
    List<Payment> findByPaymentStatus(PaymentStatus status);
}
