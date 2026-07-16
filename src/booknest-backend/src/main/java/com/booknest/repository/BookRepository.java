package com.booknest.repository;

import com.booknest.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookRepository extends JpaRepository<Book, Long> {

    Optional<Book> findByIsbn(String isbn);

    boolean existsByIsbn(String isbn);

    List<Book> findByTitleContainingIgnoreCase(String title);

    List<Book> findByAuthorContainingIgnoreCase(String author);

    List<Book> findDistinctByCategories_Id(Long categoryId);

    List<Book> findByExternalRatingGreaterThanEqual(
            Double minimumRating
    );

    List<Book> findByExternalRatingBetween(
            Double minimumRating,
            Double maximumRating
    );
}