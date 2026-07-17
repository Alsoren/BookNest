package com.booknest.controller;

import com.booknest.dto.AddBookRequest;
import com.booknest.model.Book;
import com.booknest.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    @PostMapping
    public ResponseEntity<Book> addBook(
            @RequestBody AddBookRequest request
    ) {

        Book savedBook = bookService.addBook(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedBook);
    }

    @GetMapping
    public ResponseEntity<List<Book>> getAllBooks() {

        List<Book> books = bookService.getAllBooks();

        return ResponseEntity.ok(books);
    }

    @GetMapping("/{bookId}")
    public ResponseEntity<Book> getBookById(
            @PathVariable Long bookId
    ) {

        Book book = bookService.getBookById(bookId);

        return ResponseEntity.ok(book);
    }
}