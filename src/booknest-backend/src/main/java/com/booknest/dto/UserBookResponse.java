package com.booknest.dto;

import com.booknest.model.Book;
import com.booknest.model.ReadingStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class UserBookResponse {

    private Long id;

    private Long userId;

    private String userName;

    private Book book;

    private ReadingStatus readingStatus;

    private boolean favorite;

    private Integer rating;

    private LocalDateTime addedAt;
}