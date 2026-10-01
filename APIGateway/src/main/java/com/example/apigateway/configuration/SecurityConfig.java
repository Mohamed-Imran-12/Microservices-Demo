package com.example.apigateway.configuration;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.context.NoOpServerSecurityContextRepository;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;
import tools.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final ObjectMapper objectMapper;

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity security) {
        return security
                .authorizeExchange(exchange -> exchange
                        .pathMatchers(
                                "/user-service/register",
                                "/user-service/login",
                                "/user-service/.well-known/jwks.json"
                        )
                        .permitAll()

                        .pathMatchers(
                                HttpMethod.POST,
                                "/product-service/product"
                        ).hasRole("ADMIN")

                        .pathMatchers(
                                HttpMethod.PUT,
                                "/product-service/product"
                        ).hasRole("ADMIN")

                        .pathMatchers(
                                HttpMethod.PUT,
                                "/product-service/product/stock"
                        ).hasRole("ADMIN")

                        .pathMatchers(
                                HttpMethod.GET,
                                "/product-service/products/low-stock"
                        ).hasRole("ADMIN")

                        .pathMatchers(
                                HttpMethod.GET,
                                "/product-service/product/transactions/**"
                        ).hasRole("ADMIN")

                        .pathMatchers(
                                HttpMethod.POST,
                                "/product-service/product/order"
                        ).hasRole("ADMIN")

                        .pathMatchers(
                                HttpMethod.POST,
                                "/product-service/product/return"
                        ).hasRole("ADMIN")

                        .pathMatchers(
                                HttpMethod.GET,
                                "/user-service/users"
                        ).hasRole("ADMIN")

                        .pathMatchers("/analytics-service/**").hasRole("ADMIN")
                        .anyExchange()
                        .authenticated()
                )
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .cors(corsSpec -> corsSpec.configurationSource(corsConfigurationSource()))
                .formLogin(ServerHttpSecurity.FormLoginSpec::disable)
                .logout(ServerHttpSecurity.LogoutSpec::disable)
                .securityContextRepository(NoOpServerSecurityContextRepository.getInstance())
                .oauth2ResourceServer(oauth2->
                        oauth2.jwt(jwt->
                            jwt.jwtAuthenticationConverter(new JwtRoleConverter())
                        )
                )
                .exceptionHandling(exception ->
                        exception
                                .authenticationEntryPoint((exchange, ex) ->
                                        writeErrorResponse(
                                                exchange,
                                                HttpStatus.UNAUTHORIZED,
                                                "Authentication required"))
                                .accessDeniedHandler((exchange, ex) ->
                                        writeErrorResponse(
                                                exchange,
                                                HttpStatus.FORBIDDEN,
                                                "Access denied"))
                )
                .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource corsConfigurationSource = new UrlBasedCorsConfigurationSource();
        corsConfigurationSource.registerCorsConfiguration("/**", configuration);
        return corsConfigurationSource;
    }

    private Mono<Void> writeErrorResponse(
            ServerWebExchange exchange,
            HttpStatus status,
            String message) {

        Map<String, Object> map = new LinkedHashMap<>();

        map.put("timestamp", LocalDateTime.now());
        map.put("status", status.value());
        map.put("error", status.getReasonPhrase());
        map.put("message", message);

        exchange.getResponse().setStatusCode(status);
        exchange.getResponse()
                .getHeaders()
                .setContentType(MediaType.APPLICATION_JSON);

        try {
            byte[] bytes = objectMapper.writeValueAsBytes(map);

            return exchange.getResponse().writeWith(
                    Mono.just(
                            exchange.getResponse()
                                    .bufferFactory()
                                    .wrap(bytes)
                    )
            );

        } catch (Exception e) {
            return Mono.error(e);
        }
    }
}
