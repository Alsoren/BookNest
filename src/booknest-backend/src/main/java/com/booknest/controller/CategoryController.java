package com.booknest.controller;

import com.booknest.dto.AddCategoryRequest;
import com.booknest.model.Category;
import com.booknest.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping
    public ResponseEntity<Category> addCategory(
            @RequestBody AddCategoryRequest request
    ) {
        Category savedCategory =
                categoryService.addCategory(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedCategory);
    }

    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {

        List<Category> categories =
                categoryService.getAllCategories();

        return ResponseEntity.ok(categories);
    }

    @GetMapping("/{categoryId}")
    public ResponseEntity<Category> getCategoryById(
            @PathVariable Long categoryId
    ) {
        Category category =
                categoryService.getCategoryById(categoryId);

        return ResponseEntity.ok(category);
    }

    @DeleteMapping("/{categoryId}")
    public ResponseEntity<Void> deleteCategory(
            @PathVariable Long categoryId
    ) {
        categoryService.deleteCategory(categoryId);

        return ResponseEntity.noContent().build();
    }

}