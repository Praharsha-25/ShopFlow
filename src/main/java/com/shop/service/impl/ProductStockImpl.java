package com.shop.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shop.entity.ProductStock;
import com.shop.repository.ProductStockRepository;
import com.shop.service.ProductStockService;
@Service
public class ProductStockImpl implements ProductStockService {
	@Autowired
	private ProductStockRepository psr;

	public ProductStockImpl(ProductStockRepository psr) {
		super();
		this.psr = psr;
	}
	@Override
	public List<ProductStock> getAllProducts(){
		return psr.findAll();
	}
	@Override
	public ProductStock getProductById(Long id) {
		return psr.findById(id).orElse(null);
	}
	@Override
	public void deleteProductById(Long id) {
		psr.deleteById(id);
	}
	@Override
	public ProductStock saveProduct(ProductStock ps){
		ProductStock existingProduct = psr.findByProductName(ps.getProductName());
		if(existingProduct!=null) {
			existingProduct.setStock(existingProduct.getStock()+ps.getStock());
			return psr.save(existingProduct);
		}
		return psr.save(ps);
	}
	@Override
	public ProductStock updateProduct(ProductStock ps) {
		
		return psr.save(ps);
	}
	@Override
	public List<ProductStock> getAllProductsForOwner(Long id){
		return psr.getStock(id);
	}
	@Override
	public ProductStock findProductNameForOwner(Long id, String productName) {
		return psr.findByProductNameForOwner(id, productName);
	}
}
