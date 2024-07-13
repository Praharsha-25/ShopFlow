package com.shop.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shop.entity.Owner;
import com.shop.repository.ShopFlowRepository;
import com.shop.service.ShopFlowService;

@Service
public class ShopFlowServiceImpl implements ShopFlowService {
	@Autowired
	private ShopFlowRepository sfr;
	@Override
	public List<Owner> getAllUsers(){
		return sfr.findAll();
	}
	public ShopFlowServiceImpl(ShopFlowRepository sfr) {
		super();
		this.sfr = sfr;
	}
	@Override
	public Owner saveUser(Owner owner) {
		return sfr.save(owner);
	}
	@Override
	public Owner getUserById(Long id) {
		return sfr.findById(id).orElse(null);
	}
	@Override
	public Owner updateUser(Owner owner) {
		return sfr.save(owner);
	}
	@Override
	public void deleteUserById(Long id) {
		sfr.deleteById(id);
	}
}
