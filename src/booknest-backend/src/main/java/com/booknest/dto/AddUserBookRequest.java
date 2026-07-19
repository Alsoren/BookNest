package com.booknest.dto;

import com.booknest.model.ReadingStatus;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddUserBookRequest {

    @NotNull(message = "Kitap ID boş olamaz")
    private Long bookId;

    @NotNull(message = "Okuma durumu boş olamaz")
    private ReadingStatus readingStatus;

    private boolean favorite = false;

    @Min(value = 0, message = "Rating 0'dan küçük olamaz")
    @Max(value = 5, message = "Rating 5'ten büyük olamaz")
    private Integer rating;
}