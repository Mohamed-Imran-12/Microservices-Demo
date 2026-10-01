package com.example.analyticsservice.repository;

import com.example.analyticsservice.dto.ProductSalesByRange;
import com.example.analyticsservice.dto.ProductSalesData;
import com.example.analyticsservice.dto.SalesDataByCategory;
import com.example.analyticsservice.dto.SalesDataByUser;
import com.example.analyticsservice.model.SalesRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SalesRecordRepository extends JpaRepository<SalesRecord,Long> {

    Boolean existsByOrderId( Long orderId);

    List<SalesRecord> findAllByOrderId(Long orderId);

    void deleteAllByOrderId(Long orderId);

    @Query(value = """
    SELECT
        product_id AS productId,
        MAX(product_name) AS productName,
        MAX(category) AS category,
        CAST(SUM(quantity) AS SIGNED) AS quantitySold,
        SUM(revenue)  AS revenue
    FROM sales_record
    GROUP BY product_id
    ORDER BY quantitySold DESC
    LIMIT :limit
    """,nativeQuery = true)
    List<ProductSalesData> findMostSoldProducts(@Param("limit") Integer limit);

    @Query(value = """
    SELECT
        category AS category,
        CAST(SUM(quantity) AS SIGNED) AS quantitySold,
        SUM(revenue)  AS revenue
    FROM sales_record
    GROUP BY category
    ORDER BY quantitySold DESC
    """,nativeQuery = true)
    List<SalesDataByCategory> findSalesDataByCategory();


    @Query(value = """
    SELECT
        product_id AS productId,
        MAX(product_name) AS productName,
        MAX(category) AS category,
        CAST(SUM(quantity) AS SIGNED) AS quantitySold,
        SUM(revenue)  AS revenue
    FROM sales_record
    WHERE product_id = :productId
    GROUP BY product_id
    """,nativeQuery = true)
    Optional<ProductSalesData> findProductSalesDataByProductId(@Param("productId") Long productId);

    @Query(value = """
    SELECT
        user_id AS userId,
        CAST(COUNT(DISTINCT order_id) AS SIGNED) AS totalOrders,
        CAST(SUM(quantity) AS SIGNED) AS totalItems,
        SUM(revenue)  AS totalSpent,
        SUM(revenue) / COUNT(DISTINCT order_id) AS averageOrderValue
    FROM sales_record
    WHERE user_id = :userId
    GROUP BY user_id
    """,nativeQuery = true)
    Optional<SalesDataByUser> findSalesDataByUserId(@Param("userId") Long userId);

    @Query(value = """
    SELECT
        product_id AS productId,
        MAX(product_name) AS productName,
        MAX(category) AS category,
        CAST(SUM(quantity) AS SIGNED) AS quantitySold,
        SUM(revenue)  AS revenue
    FROM sales_record
    WHERE product_id = :productId AND sold_at BETWEEN :from AND :to
    GROUP BY product_id
    """,nativeQuery = true)
    Optional<ProductSalesByRange> findProductSalesDataByRange(@Param("productId") Long productId, @Param("from") LocalDateTime from, @Param("to") LocalDateTime to);
}
