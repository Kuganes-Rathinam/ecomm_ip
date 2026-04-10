package com.ebs.orderpayment.model;

import com.ebs.orderpayment.model.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "payments")
public class Payment {

    @Id
    private String id;

    @NotBlank(message = "Order ID is required")
    @Field("order_id")
    private String orderId;

    @NotNull(message = "Amount is required")
    @Field("amount")
    private Double amount;

    @Builder.Default
    @Field("payment_status")
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    @NotBlank(message = "Payment method is required")
    @Field("payment_method")
    private String paymentMethod;
}
