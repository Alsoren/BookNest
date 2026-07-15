package com.booknest.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class LoginRequest {

    @NotBlank(message = "Email alanı boş     bırakılamaz")
    @Email(message = "Geçerli bir email adresi giriniz")
    private String email;

    @NotBlank(message = "Şifre alanı boş bırakılamaz")
    private String password;

    public LoginRequest() {
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }
}