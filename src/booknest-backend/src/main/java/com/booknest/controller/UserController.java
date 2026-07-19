package com.booknest.controller;

import com.booknest.dto.UserProfileResponse;
import com.booknest.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<?> getMyProfile(
            Authentication authentication
    ) {

        if (authentication == null) {
            return ResponseEntity
                    .status(401)
                    .body("Authentication oluşmadı.");
        }

        String email = authentication.getName();

        UserProfileResponse profile =
                userService.getProfileByEmail(email);

        return ResponseEntity.ok(profile);
    }
}