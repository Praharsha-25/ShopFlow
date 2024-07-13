package com.shop.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.shop.entity.Customer;

@Service
public interface CustomerService {
	List<Customer> getAllCustomers();
	Customer saveCustomer(Customer customer);
	Customer getCustomerById(Long id);
	Customer updateCustomer(Customer customer);
	void deleteCustomerById(Long id);
	int countCustomers(Long id);
	int countTransactionsForCustomer(Long id);
}
