package com.booknest.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class CategoryPreferenceResponse {

    private Long categoryId;

    private String categoryName;

    private long bookCount;
}