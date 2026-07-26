package com.booknest.dto;

import com.booknest.model.FriendshipStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FriendshipResponse {

    private Long friendshipId;

    private FriendUserResponse sender;

    private FriendUserResponse receiver;

    private FriendshipStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}