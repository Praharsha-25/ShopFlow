package com.shop.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.shop.entity.CustomerTransactions;
import com.shop.entity.Owner;

@Service
public interface CustomerTransactionsService {
	List<CustomerTransactions> getAllTransactions();
	CustomerTransactions saveTransaction(CustomerTransactions ct);
	CustomerTransactions getTransactionById(Long id);
	CustomerTransactions updateTransaction(CustomerTransactions ct);
	void deleteTransactionbyId(Long id);
	List<CustomerTransactions> getTransactionsForOwner(Long id);
	int countProduct(Long id);
	int totalRevenue(Long id);
	List<CustomerTransactions> getAllTransactionsForOwner(Long id);
	List<Object[]> getTop4Products(Long id);
	int countProducts(Long id);
	List<Object[]> previousWeekRevenue(Long id);
	List<Object[]> topProductPerDayForOwner(Long id);
}
