package com.shop.controller;

import java.util.Date;
import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.shop.entity.Customer;
import com.shop.entity.CustomerTransactions;
import com.shop.entity.Owner;
import com.shop.entity.ProductStock;
import com.shop.service.CustomerService;
import com.shop.service.CustomerTransactionsService;
import com.shop.service.ProductStockService;
import com.shop.service.ShopFlowService;
@CrossOrigin(origins="http://localhost:4200")
@RestController
public class ShopFlowController {
	private ShopFlowService sfs;
	private CustomerService cs;
	private CustomerTransactionsService cts;
	private ProductStockService pss;
	public ShopFlowController(ShopFlowService sfs, CustomerService cs, CustomerTransactionsService cts, ProductStockService pss) {
		super();
		this.sfs = sfs;
		this.cs = cs;
		this.cts = cts;
		this.pss = pss;
	}
	@ResponseBody
	@PostMapping("/saveuser")
	public Owner signUp(@RequestBody Owner owner) {
		return sfs.saveUser(owner);
	}
	@GetMapping("/saveuser")
	public List<Owner> users(){
		return sfs.getAllUsers();
	}
	@ResponseBody
	@PostMapping("/savecustomer")
	public Customer saveCustomer(@RequestBody Customer customer) {
		return cs.saveCustomer(customer);
	}
	@GetMapping("/savecustomer")
	public List<Customer> customers(){
		return cs.getAllCustomers();
	}
	@ResponseBody
	@PostMapping("/savetransaction")
	public CustomerTransactions saveTransaction(@RequestBody CustomerTransactions ct) {
		return cts.saveTransaction(ct);
	}
	@GetMapping("/savetransaction")
	public List<CustomerTransactions> transactions(){
		return cts.getAllTransactions();
	}
	
    @CrossOrigin(origins = "http://localhost:4200")
	@DeleteMapping("/savetransaction/{id}")
	public void deleteTransaction(@PathVariable Long id) {
		cts.deleteTransactionbyId(id);
	}
    
    @CrossOrigin(origins = "http://localhost:4200/loggedin")
    @DeleteMapping("/savecustomer/{id}")
    public void deleteCustomer(@PathVariable Long id) {
    	cs.deleteCustomerById(id);
    }
    
    @GetMapping("/getowner")
    public Owner getOwner(@RequestParam Long id) {
    	return sfs.getUserById(id);
    }
    @GetMapping("/gettransactions")
    public List<CustomerTransactions> getTransactions(@RequestParam Long id){
    	return cts.getTransactionsForOwner(id);
    }
    @GetMapping("/countcustomers")
    public int countCustomers(@RequestParam Long id) {
    	return cs.countCustomers(id);
    }
    @GetMapping("/countproducts")
    public int countProducts(@RequestParam Long id) {
    	return cts.countProduct(id);	
    }
    @GetMapping("/totalrevenue")
    public int totalRevenue(@RequestParam Long id) {
    	return cts.totalRevenue(id);
    }
    @GetMapping("/counttransactions")
    public int countTransactions(@RequestParam Long id) {
    	return cs.countTransactionsForCustomer(id);
    }
    @GetMapping("/getownerdob")
    public Date getDob(@RequestParam Long id) {
    	return sfs.getUserById(id).getDob();
    }
    @GetMapping("/getalltransactions")
    public List<CustomerTransactions> getAllTransactions(@RequestParam Long id){
    	return cts.getAllTransactionsForOwner(id);
    }
    @GetMapping("/gettop4")
    public List<Object[]> getTop4(@RequestParam Long id){
    	return cts.getTop4Products(id);
    }
    @GetMapping("/total")
    public int total(@RequestParam Long id) {
    	return cts.countProducts(id);
    }
    @GetMapping("/weekrevenue")
    public List<Object[]> weekRevenue(@RequestParam Long id){
    	return cts.previousWeekRevenue(id);
    }
    @GetMapping("/gettopproductlist")
    public List<Object[]> getTopProductList(@RequestParam Long id){
    	return cts.topProductPerDayForOwner(id);
    }
    
    @CrossOrigin(origins = "http://localhost:4200")
    @PostMapping("/saveproductstock")
    public ProductStock saveProductStock(@RequestBody ProductStock ps) {
    	return pss.saveProduct(ps);
    }
    @GetMapping("getallproductstock")
    public List<ProductStock> getAllProductStock(@RequestParam Long id){
    	return pss.getAllProductsForOwner(id);
    }
    @DeleteMapping("deleteproduct")
    public void deleteProduct(@RequestParam Long id) {
    	pss.deleteProductById(id);
    }
    @PutMapping("updateproductstock")
    public ProductStock updateProductStock(@RequestBody ProductStock ps) {
    	return pss.updateProduct(ps);
    }
    @GetMapping("findbyproductnameforowner")
    public ProductStock findByProductNameForOwner(@RequestParam Long id, @RequestParam String productName) {
    	return pss.findProductNameForOwner(id, productName);
    }
}
