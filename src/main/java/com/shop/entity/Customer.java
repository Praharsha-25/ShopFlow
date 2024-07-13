package com.shop.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.Data;
@Data
@Entity
@Table(name="customer")
public class Customer {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;
	@Column(name="customerName")
	private String customerName;
	@Column(name="phnNo")
	private long phnNo;
	@ManyToMany(mappedBy="customers", targetEntity=Owner.class)
	private List<Owner> owners = new ArrayList<>();
	@ManyToOne
	@JoinColumn(name="owner_id", referencedColumnName = "id")
	private Owner owner;
	
}
