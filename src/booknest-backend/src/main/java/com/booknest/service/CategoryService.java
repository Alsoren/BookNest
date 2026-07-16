package com.booknest.service;

import com.booknest.dto.AddCategoryRequest;
import com.booknest.model.Category;
import com.booknest.repository.CategoryRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public Category addCategory(AddCategoryRequest request) {

        if (
                request.getName() == null ||
                        request.getName().isBlank()
        ) {
            throw new RuntimeException(
                    "Kategori adı boş bırakılamaz"
            );
        }

        String categoryName = request.getName().trim();

        if (
                categoryRepository.existsByNameIgnoreCase(
                        categoryName
                )
        ) {
            throw new RuntimeException(
                    "Bu kategori zaten bulunuyor"
            );
        }

        Category category = Category.builder()
                .name(categoryName)
                .build();

        return categoryRepository.save(category);
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category getCategoryById(Long categoryId) {

        return categoryRepository.findById(categoryId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Kategori bulunamadı"
                        )
                );
    }

    public void deleteCategory(Long categoryId) {

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() ->
                        new RuntimeException("Kategori bulunamadı")
                );

        categoryRepository.delete(category);
    }

}