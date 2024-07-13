package com.shop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.shop.entity.Customer;
@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
	@Query("select c from Customer c where c.customerName = :customerName and c.phnNo = :phnNo and c.owner.id = :ownerId")
	Customer findByCustomerNameAndPhnNoAndOwnerId(@Param("customerName")String customerName, @Param("phnNo") Long phnNo, @Param("ownerId") Long ownerId);
	@Query("select count(distinct t.customer.id) from CustomerTransactions t where t.customer.owner.id = :id and date(t.date) = current_date")
	int countById(@Param("id") Long id);
	@Query("select count(t.customer) from CustomerTransactions t where t.customer.id = :id")
	int countTransactions(@Param("id") Long id);
}
