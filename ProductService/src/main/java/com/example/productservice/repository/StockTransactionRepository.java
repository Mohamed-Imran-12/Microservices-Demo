package com.example.productservice.repository;

import com.example.productservice.model.StockTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockTransactionRepository extends JpaRepository<StockTransaction,Long> {

    List<StockTransaction> findAllByProductId( Long productId);
}
