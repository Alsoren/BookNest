package com.booknest.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SendFriendRequest {

    @NotNull(message = "Arkadaşlık isteği gönderilecek kullanıcı zorunludur.")
    private Long receiverId;
}