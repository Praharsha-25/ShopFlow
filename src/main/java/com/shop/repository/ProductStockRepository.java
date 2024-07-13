package com.shop.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.shop.entity.ProductStock;

@Repository
public interface ProductStockRepository extends JpaRepository<ProductStock, Long> {
	@Query("select ps from ProductStock ps where ps.owner.id = :id")
	List<ProductStock> getStock(@Param("id") Long id);
	ProductStock findByProductName(@Param("productName") String name);
	@Query("select ps from ProductStock ps where ps.owner.id = :id and ps.productName = :productName")
	ProductStock findByProductNameForOwner(@Param("id") Long id, @Param("productName") String productName);
}
