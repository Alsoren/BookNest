package com.booknest.service;

import com.booknest.dto.UserProfileResponse;
import com.booknest.model.User;
import com.booknest.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserProfileResponse getProfileByEmail(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Kullanıcı bulunamadı.")
                );

        return UserProfileResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .agreeToUpdates(user.isAgreeToUpdates())
                .build();
    }
}