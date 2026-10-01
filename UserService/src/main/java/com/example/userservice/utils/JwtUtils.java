package com.example.userservice.utils;

import io.jsonwebtoken.Jwts;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
@RequiredArgsConstructor
public class JwtUtils {
    private final KeyGeneratorUtils keyGeneratorUtils;

    public String generateJwt(String email,String role){
        long duration = 24 * 60 * 60 * 1000L;
        return Jwts
                .builder()
                .subject(email)
                .claim("role",role)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis()+ duration))
                .header()
                .keyId("access-token")
                .and()
                .signWith(keyGeneratorUtils.getKeyPair().getPrivate(),Jwts.SIG.RS256)
                .compact();

    }
}
