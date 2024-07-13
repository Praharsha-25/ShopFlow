package com.shop.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.shop.entity.CustomerTransactions;
@Repository
public interface CustomerTransactionsRepository extends JpaRepository<CustomerTransactions, Long> {
	@Query("select count(t.productName) from CustomerTransactions t where t.customer.owner.id = :id and date(t.date) = current_date")
	int countProd(@Param("id") Long id);
	@Query("select sum(t.productPrice) from CustomerTransactions t where t.customer.owner.id = :id and date(t.date) = current_date")
	int countTotal(@Param("id") Long id);
	@Query("select t from CustomerTransactions t where t.customer.owner.id = :id and date(t.date) = current_date")
	List<CustomerTransactions> getTransactions(@Param("id") Long id);
	@Query("select t from CustomerTransactions t where t.customer.owner.id = :id")
	List<CustomerTransactions> getAllTransactions(@Param("id") Long id);
	@Query("select count(t.productName)as count, t.productName from CustomerTransactions t where t.customer.owner.id = :id group by t.productName order by count desc")
	List<Object[]> findTop4Products(@Param("id") Long id);
	@Query("select count(t) from CustomerTransactions t where t.customer.owner.id = :id")
	int totalProducts(@Param("id") Long id);
	@Query("select sum(t.productPrice), Date(date) as date_only from CustomerTransactions t where t.customer.owner.id = :id and Date(date)!=Date(current_date) group by date_only order by date_only desc")
	List<Object[]> previous7DaysRevenue(@Param("id") Long id);
	@Query(value = "SELECT t.productName, t.productCount, t.date " +
            "FROM (SELECT ct.product_name AS productName, COUNT(ct.product_name) AS productCount, DATE(ct.date) AS date, " +
            "ROW_NUMBER() OVER (PARTITION BY DATE(ct.date) ORDER BY COUNT(ct.product_name) DESC) AS row_num " +
            "FROM customer_transactions ct " +
            "JOIN customer c ON ct.customer_id = c.id " +
            "WHERE c.owner_id = :id " +
            "GROUP BY ct.product_name, DATE(ct.date)) t " +
            "WHERE t.row_num = 1 " +
            "ORDER BY t.date DESC, t.productCount DESC",
    nativeQuery = true)
	List<Object[]> topProductForOwner(@Param("id") Long id);

}
