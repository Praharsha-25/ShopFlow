package com.shop.entity;

import java.util.Date;

import jakarta.persistence.*;
import lombok.Data;
@Data
@Entity
@Table(name="customer_transactions")
public class CustomerTransactions {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;
	@ManyToOne
	@JoinColumn(name="customer_id", nullable=false)
	private Customer customer;
	@Column(name="productName")
	private String productName;
	@Column(name="productPrice")
	private long productPrice;
	@Column(name="date")
	private Date date = new Date();
}
