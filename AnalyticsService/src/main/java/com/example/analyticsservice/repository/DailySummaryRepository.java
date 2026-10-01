package com.example.analyticsservice.repository;

import com.example.analyticsservice.dto.DashboardData;
import com.example.analyticsservice.dto.RevenueByRange;
import com.example.analyticsservice.dto.SalesTrendData;
import com.example.analyticsservice.model.DailySummary;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DailySummaryRepository extends JpaRepository<DailySummary,Long> {

     @Lock(LockModeType.PESSIMISTIC_WRITE)
     Optional<DailySummary> findByDate(LocalDate date);

     @Query(value = """
    SELECT
        CAST(COALESCE(SUM(total_orders), 0) AS SIGNED) AS totalOrders,
        CAST(COALESCE(SUM(total_items), 0) AS SIGNED) AS totalItems,
        COALESCE(SUM(revenue), 0) AS totalRevenue,
        COALESCE(
            SUM(revenue) / NULLIF(SUM(total_orders), 0),
            0
        ) AS averageOrderValue
    FROM daily_summary
    """, nativeQuery = true)
     DashboardData findDashboardSummary();

     @Query(value = """
     SELECT
          date as date,
          total_orders as totalOrders,
          total_items as totalItems,
          revenue as revenue
     FROM daily_summary WHERE
          date BETWEEN :from AND :to
     ORDER BY date
     """,nativeQuery = true)
     List<SalesTrendData> findSalesTrendByRange(@Param("from") LocalDate from , @Param("to") LocalDate to);

     @Query(value = """
     SELECT
        COALESCE(SUM(revenue), 0.0) AS totalRevenue,
        COALESCE(CAST(SUM(total_orders) AS SIGNED), 0) AS totalOrders,
        COALESCE(CAST(SUM(total_items) AS SIGNED), 0) AS totalItems,
        COALESCE(SUM(revenue) / NULLIF(SUM(total_orders), 0), 0.0) AS averageOrderValue
     FROM daily_summary
         WHERE date BETWEEN :from AND :to
     """,nativeQuery = true)
     RevenueByRange findRevenueByRange(@Param("from") LocalDate from , @Param("to") LocalDate to);
}
