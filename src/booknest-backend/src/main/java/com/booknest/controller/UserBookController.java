package com.booknest.controller;

import com.booknest.dto.AddUserBookRequest;
import com.booknest.dto.CategoryPreferenceResponse;
import com.booknest.dto.UpdateReadingStatusRequest;
import com.booknest.model.ReadingStatus;
import com.booknest.model.UserBook;
import com.booknest.service.UserBookService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user-books")
@RequiredArgsConstructor
public class UserBookController {

    private final UserBookService userBookService;

    // Kullanıcının kütüphanesine kitap ekler
    @PostMapping
    public ResponseEntity<UserBook> addBookToUser(
            Authentication authentication,
            @Valid @RequestBody AddUserBookRequest request
    ) {

        String email = authentication.getName();

        UserBook savedUserBook =
                userBookService.addBookToUser(
                        email,
                        request.getBookId(),
                        request.getReadingStatus(),
                        request.isFavorite(),
                        request.getRating()
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedUserBook);
    }

    @DeleteMapping("/me/book/{bookId}")
    public ResponseEntity<Void> removeBookFromLibrary(
            Authentication authentication,
            @PathVariable Long bookId
    ) {
        String email = authentication.getName();

        userBookService.removeBookFromUser(
                email,
                bookId
        );

        return ResponseEntity.noContent().build();
    }

    // Giriş yapan kullanıcının bütün kitaplarını getirir
    @GetMapping("/me")
    public ResponseEntity<List<UserBook>> getMyBooks(
            Authentication authentication
    ) {

        String email = authentication.getName();

        List<UserBook> userBooks =
                userBookService.getUserBooks(email);

        return ResponseEntity.ok(userBooks);
    }

    // Belirli bir kitap kullanıcının kütüphanesinde mi kontrol eder
    @GetMapping("/me/book/{bookId}")
    public ResponseEntity<UserBook> getMyBook(
            @PathVariable Long bookId,
            Authentication authentication
    ) {

        String email = authentication.getName();

        UserBook userBook =
                userBookService.getMyBook(
                        email,
                        bookId
                );

        return ResponseEntity.ok(userBook);
    }

    // Kullanıcının belirli durumdaki kitaplarını getirir
    @GetMapping("/me/status/{readingStatus}")
    public ResponseEntity<List<UserBook>> getMyBooksByStatus(
            Authentication authentication,
            @PathVariable ReadingStatus readingStatus
    ) {

        String email = authentication.getName();

        List<UserBook> userBooks =
                userBookService.getUserBooksByStatus(
                        email,
                        readingStatus
                );

        return ResponseEntity.ok(userBooks);
    }

    // Kitabın okuma durumunu değiştirir
    @PatchMapping("/me/book/{bookId}/status")
    public ResponseEntity<UserBook> updateReadingStatus(
            Authentication authentication,
            @PathVariable Long bookId,
            @Valid @RequestBody UpdateReadingStatusRequest request
    ) {

        String email = authentication.getName();

        UserBook updatedUserBook =
                userBookService.updateReadingStatus(
                        email,
                        bookId,
                        request.getReadingStatus()
                );

        return ResponseEntity.ok(updatedUserBook);
    }

    @GetMapping("/me/top-categories")
    public ResponseEntity<List<CategoryPreferenceResponse>>
    getMyTopCategories(Authentication authentication){
        String email = authentication.getName();

        List<CategoryPreferenceResponse> categories =
                userBookService.getMostPreferredCategories(email);

        return ResponseEntity.ok(categories);
    }
}