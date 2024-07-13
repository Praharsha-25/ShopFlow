package com.shop.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shop.entity.Customer;
import com.shop.repository.CustomerRepository;
import com.shop.service.CustomerService;
@Service
public class CustomerServiceImpl implements CustomerService {
	@Autowired
	private CustomerRepository cr;

	public CustomerServiceImpl(CustomerRepository cr) {
		super();
		this.cr = cr;
	}
	@Override
	public List<Customer> getAllCustomers(){
		return cr.findAll();
	}
	@Override
	public Customer saveCustomer(Customer customer) {
		Customer existingCustomer = cr.findByCustomerNameAndPhnNoAndOwnerId(customer.getCustomerName(), customer.getPhnNo(), customer.getOwner().getId());
		if(existingCustomer == null)
			return cr.save(customer);
		return customer;
	}
	@Override
	public Customer getCustomerById(Long id) {
		return cr.findById(id).orElse(null);
	}
	@Override
	public Customer updateCustomer(Customer customer) {
		return cr.save(customer);
	}
	@Override
	public void deleteCustomerById(Long id) {
		cr.deleteById(id);
	}
	@Override
	public int countCustomers(Long id) {
		return cr.countById(id);
	}
	@Override
	public int countTransactionsForCustomer(Long id) {
		return cr.countTransactions(id);
	}
}
