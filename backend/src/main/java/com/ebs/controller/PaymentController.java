package com.ebs.controller;

import com.ebs.model.Payment;
import com.ebs.model.enums.PaymentStatus;
import com.ebs.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<Payment> createPayment(@RequestBody Map<String, Object> body) {
        String orderId = (String) body.get("orderId");
        Double amount = Double.parseDouble(body.get("amount").toString());
        String method = (String) body.get("paymentMethod");
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(paymentService.createPayment(orderId, amount, method));
    }

    @GetMapping("/{paymentId}")
    public ResponseEntity<Payment> getById(@PathVariable String paymentId) {
        return paymentService.getPaymentById(paymentId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<Payment> getByOrderId(@PathVariable String orderId) {
        return paymentService.getPaymentByOrderId(orderId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{paymentId}/status")
    public ResponseEntity<Payment> updateStatus(
            @PathVariable String paymentId,
            @RequestBody Map<String, String> body) {
        PaymentStatus status = PaymentStatus.valueOf(body.get("status").toUpperCase());
        return ResponseEntity.ok(paymentService.updatePaymentStatus(paymentId, status));
    }

    @GetMapping
    public ResponseEntity<List<Payment>> getAll() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }
}
