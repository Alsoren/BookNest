package com.booknest.service;

import com.booknest.dto.AddBookRequest;
import com.booknest.model.Book;
import com.booknest.model.Category;
import com.booknest.repository.BookRepository;
import com.booknest.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;

    public Book addBook(AddBookRequest request) {

        if (
                request.getIsbn() != null &&
                        !request.getIsbn().isBlank() &&
                        bookRepository.existsByIsbn(request.getIsbn())
        ) {
            throw new RuntimeException(
                    "Bu ISBN numarasına sahip kitap zaten bulunuyor"
            );
        }

        Set<Category> categories = new HashSet<>();

        if (
                request.getCategoryIds() != null &&
                        !request.getCategoryIds().isEmpty()
        ) {
            List<Category> foundCategories =
                    categoryRepository.findAllById(
                            request.getCategoryIds()
                    );

            if (
                    foundCategories.size() !=
                            request.getCategoryIds().size()
            ) {
                throw new RuntimeException(
                        "Gönderilen kategori ID'lerinden biri bulunamadı"
                );
            }

            categories.addAll(foundCategories);
        }

        Book book = Book.builder()
                .title(request.getTitle())
                .author(request.getAuthor())
                .isbn(request.getIsbn())
                .imageUrl(request.getImageUrl())
                .pubYear(request.getPubYear())
                .externalRating(request.getExternalRating())
                .categories(categories)
                .build();

        return bookRepository.save(book);
    }

    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public Book getBookById(Long bookId) {
        return bookRepository.findById(bookId)
                .orElseThrow(() ->
                        new RuntimeException("Kitap bulunamadı")
                );
    }
}