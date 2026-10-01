package com.example.apigateway.configuration;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
@Slf4j
public class LoggingFilter implements GlobalFilter {
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        long start = System.currentTimeMillis();
        String name = exchange.getRequest().getMethod().name();
        String path = exchange.getRequest().getPath().value();
        log.info("Incoming request {} : {}",name,path);

        return chain.filter(exchange).doFinally(signal->{
            int status =  exchange.getResponse()
                    .getStatusCode() != null
                    ? exchange.getResponse()
                    .getStatusCode()
                    .value()
                    : 0;
            long time = System.currentTimeMillis()-start;
            log.info( "Completed: {} {} → {} ({} ms, signal={})",
                    name,
                    path,
                    status,
                    time,
                    signal);
        });
    }
}
