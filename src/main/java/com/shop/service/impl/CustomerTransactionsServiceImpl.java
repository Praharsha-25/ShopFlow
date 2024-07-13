package com.shop.service.impl;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shop.entity.Customer;
import com.shop.entity.CustomerTransactions;
import com.shop.entity.Owner;
import com.shop.repository.CustomerRepository;
import com.shop.repository.CustomerTransactionsRepository;
import com.shop.service.CustomerTransactionsService;
import com.shop.service.ShopFlowService;

import jakarta.transaction.Transactional;

@Service
public class CustomerTransactionsServiceImpl implements CustomerTransactionsService {
	@Autowired
	private CustomerTransactionsRepository ctr;
	@Autowired
	private CustomerRepository cr;
	public CustomerTransactionsServiceImpl(CustomerTransactionsRepository ctr, CustomerRepository cr) {
		super();
		this.ctr = ctr;
		this.cr = cr;
	}
	@Override
	public List<CustomerTransactions> getAllTransactions(){
		return ctr.findAll();
	}
	@Transactional
	public CustomerTransactions saveTransaction(CustomerTransactions ct) {
		Customer customer = ct.getCustomer();
		if(customer != null && customer.getOwner() != null) {
	        Long ownerId = customer.getOwner().getId();
			Customer existingCustomer = cr.findByCustomerNameAndPhnNoAndOwnerId(customer.getCustomerName(), customer.getPhnNo(), ownerId);
			if(existingCustomer == null) {
				customer = cr.save(customer);
			}
			else {
				customer = existingCustomer;
			}
			ct.setCustomer(customer);
			return ctr.save(ct);
		}
		else {
	        throw new IllegalArgumentException("Customer or owner cannot be null");
	    }
	}
	@Override
	public CustomerTransactions getTransactionById(Long id) {
		return ctr.findById(id).orElse(null);
	}
	@Override
	public CustomerTransactions updateTransaction(CustomerTransactions ct) {
		return ctr.save(ct);
	}
	@Override
	public void deleteTransactionbyId(Long id) {
		ctr.deleteById(id);
	}
	@Override
	public List<CustomerTransactions> getTransactionsForOwner(Long id){
		return ctr.getTransactions(id);
	}
	@Override
	public int countProduct(Long id) {
		return ctr.countProd(id);
	}
	@Override
	public int totalRevenue(Long id) {
		Integer total = ctr.countTotal(id);
		return total != null ? total : 0;
	}
	@Override
	public List<CustomerTransactions> getAllTransactionsForOwner(Long id){
		return ctr.getAllTransactions(id);
	}
	@Override
	public List<Object[]> getTop4Products(Long id){
		List<Object[]> details = ctr.findTop4Products(id);
		return details.stream().limit(4).collect(Collectors.toList());
	}
	@Override
	public int countProducts(Long id) {
		return ctr.totalProducts(id);
	}
	@Override
	public List<Object[]> previousWeekRevenue(Long id) {
		List<Object[]> details = ctr.previous7DaysRevenue(id);
		return details.stream().limit(7).collect(Collectors.toList());
	}
	@Override
	public List<Object[]> topProductPerDayForOwner(Long ownerId) {
        List<Object[]> products = ctr.topProductForOwner(ownerId);
        return products.stream().limit(7).collect(Collectors.toList());
    }
}
