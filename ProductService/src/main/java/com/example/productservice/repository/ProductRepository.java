package com.example.productservice.repository;

import com.example.productservice.dto.ProductLowStockResponse;
import com.example.productservice.dto.ProductSearchResponse;
import com.example.productservice.model.Product;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product,Long> {

    @Query(value = "SELECT id, name, stock FROM product WHERE stock <= 10",nativeQuery = true)
    List<ProductLowStockResponse> findProductsByLowStock();

    @Query(value = """
    SELECT
        id AS id,
        name AS name,
        category AS category
    FROM product
        WHERE name LIKE :keyword OR category LIKE :keyword
    ORDER BY name
    LIMIT 5
    """,nativeQuery = true)
    List<ProductSearchResponse> findProductByKeyword(@Param("keyword") String keyword);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM Product p WHERE p.id = :id")
    Optional<Product> findByIdForUpdate(@Param("id") Long id);

}
