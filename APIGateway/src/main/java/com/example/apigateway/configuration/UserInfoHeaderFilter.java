package com.example.apigateway.configuration;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class UserInfoHeaderFilter implements GlobalFilter {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {

        return exchange.getPrincipal()
                .cast(JwtAuthenticationToken.class)
                .flatMap(authentication -> {
                    String email = authentication
                            .getToken()
                            .getSubject();
                    String role = authentication
                            .getToken()
                            .getClaimAsString("role");
                    ServerWebExchange modifiedExchange =
                            exchange.mutate()
                                    .request(request -> request
                                            .headers(headers -> {
                                                headers.remove("X-User-Email");
                                                headers.remove("X-User-Role");
                                                headers.add("X-User-Email", email);
                                                headers.add("X-User-Role", role);
                                            })
                                    )
                                    .build();

                    return chain.filter(modifiedExchange);
                })
                .switchIfEmpty(chain.filter(exchange));
    }
}