package com.booknest.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AddBookRequest {

    private String title;

    private String author;

    private String isbn;

    private String imageUrl;

    private int pubYear;

    @DecimalMin(
            value = "0.0",
            message = "Rating 0'dan küçük olamaz"
    )
    @DecimalMax(
            value = "5.0",
            message = "Rating 5'ten büyük olamaz"
    )
    private Double externalRating;


    private Set<Long> categoryIds = new HashSet<>();
}