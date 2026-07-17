package com.booknest.repository;

import com.booknest.model.ReadingStatus;
import com.booknest.model.UserBook;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserBookRepository
        extends JpaRepository<UserBook, Long> {

    List<UserBook> findByUserId(Long userId);

    List<UserBook> findByUserIdAndReadingStatus(
            Long userId,
            ReadingStatus readingStatus
    );

    Optional<UserBook> findByUserIdAndBookId(
            Long userId,
            Long bookId
    );

    boolean existsByUserIdAndBookId(
            Long userId,
            Long bookId
    );
}