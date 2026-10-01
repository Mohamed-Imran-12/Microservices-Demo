package com.example.apigateway.configuration;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfiguration {

    @Bean
    public RouteLocator routeLocator(RouteLocatorBuilder builder){

        return builder.routes()
                .route("user-service",route-> route
                        .path("/user-service/**")
                        .uri("lb://USERSERVICE")
                )
                .route("product-service",route-> route
                        .path("/product-service/**")
                        .uri("lb://PRODUCTSERVICE")
                )
                .route("order-service",route-> route
                        .path("/order-service/**")
                        .uri("lb://ORDERSERVICE")
                )
                .route("analytics-service",route-> route
                        .path("/analytics-service/**")
                        .uri("lb://ANALYTICSSERVICE")
                )
                .build();


    }
}
