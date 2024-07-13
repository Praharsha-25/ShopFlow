package com.shop.entity;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import jakarta.persistence.*;
import lombok.Data;
@Data
@Entity
@Table(name = "Owner")
public class Owner {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;
	@Column(name="email")
	private String email;
	@Column(name="pwd")
	private String pwd;
	@Column(name="dob")
	private Date dob = new Date();
	@Column(name="firstName")
	private String firstName;
	@Column(name="lastName")
	private String lastName;
	@Column(name="gender")
	private String gender;
	@Column(name = "businessName")
	private String businessName = "ShopFlow";
	@ManyToMany(targetEntity=Customer.class)
	private List<Customer> customers = new ArrayList<>();
}
