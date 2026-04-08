package com.ebs.repository;

import com.ebs.model.Payment;
import com.ebs.model.enums.PaymentStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends MongoRepository<Payment, String> {
    Optional<Payment> findByOrderId(String orderId);
    List<Payment> findByPaymentStatus(PaymentStatus paymentStatus);
}
