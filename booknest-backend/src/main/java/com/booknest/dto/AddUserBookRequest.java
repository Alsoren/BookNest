package com.booknest.dto;

import com.booknest.model.ReadingStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddUserBookRequest {

    private Long userId;
    private Long bookId;
    private ReadingStatus readingStatus;
}
