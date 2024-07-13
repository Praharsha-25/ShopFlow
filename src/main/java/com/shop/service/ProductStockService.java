package com.shop.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.shop.entity.ProductStock;

@Service
public interface ProductStockService {
	List<ProductStock> getAllProducts();
	ProductStock getProductById(Long id);
	void deleteProductById(Long id);
	ProductStock saveProduct(ProductStock ps);
	ProductStock updateProduct(ProductStock ps);
	List<ProductStock> getAllProductsForOwner(Long id);
	ProductStock findProductNameForOwner(Long id, String productName);
}
