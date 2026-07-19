package com.booknest.config;

import com.booknest.service.JwtService;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authorizationHeader =
                request.getHeader("Authorization");

        // Authorization header yoksa veya Bearer ile başlamıyorsa
        // isteği normal şekilde devam ettir.
        if (authorizationHeader == null ||
                !authorizationHeader.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);
            return;
        }

        // "Bearer " kısmından sonraki gerçek JWT
        String token = authorizationHeader.substring(7);

        try {
            String email = jwtService.extractEmail(token);

            boolean authenticationNotCreated =
                    SecurityContextHolder
                            .getContext()
                            .getAuthentication() == null;

            if (email != null &&
                    authenticationNotCreated &&
                    jwtService.isTokenValid(token, email)) {

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                email,
                                null,
                                Collections.emptyList()
                        );

                authentication.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request)
                );

                SecurityContext securityContext =
                        SecurityContextHolder.createEmptyContext();

                securityContext.setAuthentication(authentication);

                SecurityContextHolder.setContext(securityContext);
            }

        } catch (JwtException | IllegalArgumentException exception) {
            // Token geçersiz, süresi dolmuş veya bozuk.
            // Authentication oluşturulmadan devam edilir.
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }
}