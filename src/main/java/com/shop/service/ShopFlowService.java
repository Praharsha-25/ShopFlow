package com.shop.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.shop.entity.Owner;


@Service
public interface ShopFlowService {
	List<Owner> getAllUsers();
	Owner saveUser(Owner owner);
	Owner getUserById(Long id);
	Owner updateUser(Owner owner);
	void deleteUserById(Long id);
}
