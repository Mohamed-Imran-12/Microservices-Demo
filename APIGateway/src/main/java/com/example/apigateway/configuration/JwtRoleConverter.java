package com.example.apigateway.configuration;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import reactor.core.publisher.Mono;

import java.util.List;

public class JwtRoleConverter
        implements Converter<Jwt, Mono<AbstractAuthenticationToken>> {

    @Override
    public Mono<AbstractAuthenticationToken> convert(Jwt jwt) {

        String role = jwt.getClaimAsString("role");

        if (!"USER".equals(role) && !"ADMIN".equals(role)) {
            return Mono.error(
                    new BadCredentialsException("Invalid role")
            );
        }

        List<SimpleGrantedAuthority> authorities =
                List.of(
                        new SimpleGrantedAuthority("ROLE_" + role)
                );

        return Mono.just(
                new JwtAuthenticationToken(jwt, authorities)
        );
    }
}