package com.shop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.shop.entity.Owner;
@Repository
public interface ShopFlowRepository extends JpaRepository<Owner, Long> {

}
