package com.booknest.dto;

import com.booknest.model.ReadingStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateReadingStatusRequest {

    @NotNull(message = "Okuma durumu boş bırakılamaz")
    private ReadingStatus readingStatus;
}