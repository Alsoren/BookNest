package com.booknest.service;

import com.booknest.dto.LoginRequest;
import com.booknest.dto.LoginResponse;
import com.booknest.dto.RegisterRequest;
import com.booknest.dto.RegisterResponse;
import com.booknest.model.User;
import com.booknest.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public RegisterResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            return new RegisterResponse("Bu email zaten kullanılıyor.", false);
        }

        String hashedPassword = passwordEncoder.encode(request.getPassword());

        User user = new User(
                request.getName(),
                request.getEmail(),
                hashedPassword,
                request.isAgreeToUpdates()
        );

        userRepository.save(user);

        return new RegisterResponse("Kayıt başarılı.", true);
    }

    public LoginResponse login(LoginRequest request){
        Optional<User> optionalUser = userRepository.findByEmail(request.getEmail());

        if (optionalUser.isEmpty()) {
            return new LoginResponse("Email veya şifre hatalı.", false, null);
        }

        User user = optionalUser.get();

        boolean passwordMatches = passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        );

        if (!passwordMatches){
            return new LoginResponse("Email veya şifre hatalı.", false, null);
        }

        String token = jwtService.generateToken(user.getEmail());

        return new LoginResponse("Giriş başarılı.", true, token);
    }
}