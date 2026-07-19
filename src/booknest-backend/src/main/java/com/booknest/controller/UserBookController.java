package com.booknest.controller;

import com.booknest.dto.AddUserBookRequest;
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

    @GetMapping("/me")
    public ResponseEntity<List<UserBook>> getMyBooks(
            Authentication authentication
    ) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                userBookService.getUserBooks(email)
        );
    }

    @GetMapping("/me/status/{readingStatus}")
    public ResponseEntity<List<UserBook>> getMyBooksByStatus(
            Authentication authentication,
            @PathVariable ReadingStatus readingStatus
    ) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                userBookService.getUserBooksByStatus(
                        email,
                        readingStatus
                )
        );
    }
}