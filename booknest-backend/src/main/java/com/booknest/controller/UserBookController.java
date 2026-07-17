package com.booknest.controller;

import com.booknest.dto.AddUserBookRequest;
import com.booknest.model.ReadingStatus;
import com.booknest.model.UserBook;
import com.booknest.service.UserBookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user-books")
@RequiredArgsConstructor
public class UserBookController {

    private final UserBookService userBookService;

    @PostMapping
    public ResponseEntity<UserBook> addBookToUser(
            @RequestBody AddUserBookRequest request
    ) {

        UserBook savedUserBook =
                userBookService.addBookToUser(
                        request.getUserId(),
                        request.getBookId(),
                        request.getReadingStatus()
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedUserBook);
    }


    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserBook>> getUserBooks(
            @PathVariable Long userId
    ) {

        List<UserBook> userBooks =
                userBookService.getUserBooks(userId);

        return ResponseEntity.ok(userBooks);
    }

    @GetMapping("/user/{userId}/status/{readingStatus}")
    public ResponseEntity<List<UserBook>> getUserBooksByStatus(
            @PathVariable Long userId,
            @PathVariable ReadingStatus readingStatus
    ) {

        List<UserBook> userBooks =
                userBookService.getUserBooksByStatus(
                        userId,
                        readingStatus
                );

        return ResponseEntity.ok(userBooks);
    }
}

