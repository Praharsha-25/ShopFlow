package com.shop.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "product_stock")
public class ProductStock {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;
	@Column(name="product_Name", nullable=false)
	private String productName;
	@Column(name="stock", nullable=false)
	private int stock;
	@ManyToOne
	@JoinColumn(name="owner_id", nullable=false)
	private Owner owner;
}
